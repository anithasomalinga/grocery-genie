import os
import uuid
from datetime import date
from typing import Optional

import anthropic
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Receipt, ReceiptItem
from schemas import ReceiptOut, ReceiptListItem, UploadResponse
from services import ocr, llm

router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

ACCEPTED_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/webp",
    "image/heic", "image/heif", "image/tiff",
    "application/octet-stream",  # some browsers send HEIC as this
}


@router.post("/upload", response_model=UploadResponse)
async def upload_receipt(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content_type = (file.content_type or "").lower()
    if content_type and not content_type.startswith("image/") and content_type not in ACCEPTED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")

    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    image_path = os.path.join(UPLOAD_DIR, filename)

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    contents = await file.read()
    with open(image_path, "wb") as f:
        f.write(contents)

    try:
        raw_text = ocr.extract_text(image_path)
    except Exception as e:
        os.remove(image_path)
        raise HTTPException(status_code=422, detail=f"Could not read image: {e}")

    try:
        parsed = llm.parse_receipt(raw_text)
    except anthropic.BadRequestError as e:
        raise HTTPException(status_code=402, detail=str(e))
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API error: {e}")

    purchase_date: Optional[date] = None
    if parsed.get("purchase_date"):
        try:
            purchase_date = date.fromisoformat(parsed["purchase_date"])
        except ValueError:
            pass

    items_data = parsed.get("items", [])
    total_amount = sum(item.get("price") or 0 for item in items_data)

    receipt = Receipt(
        store_name=parsed.get("store_name"),
        purchase_date=purchase_date,
        total_amount=total_amount,
        image_path=f"/uploads/{filename}",
        raw_text=raw_text,
    )
    db.add(receipt)
    db.flush()

    for item in items_data:
        db.add(ReceiptItem(
            receipt_id=receipt.id,
            name=item.get("name", "Unknown"),
            price=float(item.get("price") or 0),
            quantity=int(item.get("quantity", 1)),
            category=item.get("category"),
        ))

    db.commit()
    db.refresh(receipt)

    return UploadResponse(receipt=receipt, message="Receipt processed successfully")


@router.get("", response_model=list[ReceiptListItem])
def list_receipts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    receipts = db.query(Receipt).order_by(Receipt.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for r in receipts:
        item_count = db.query(func.count(ReceiptItem.id)).filter(ReceiptItem.receipt_id == r.id).scalar()
        result.append(ReceiptListItem(
            id=r.id,
            store_name=r.store_name,
            purchase_date=r.purchase_date,
            total_amount=r.total_amount,
            created_at=r.created_at,
            item_count=item_count,
        ))
    return result


@router.get("/{receipt_id}", response_model=ReceiptOut)
def get_receipt(receipt_id: int, db: Session = Depends(get_db)):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt


@router.delete("/{receipt_id}", status_code=204)
def delete_receipt(receipt_id: int, db: Session = Depends(get_db)):
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    if receipt.image_path:
        full_path = os.path.join(UPLOAD_DIR, os.path.basename(receipt.image_path))
        if os.path.exists(full_path):
            os.remove(full_path)
    db.delete(receipt)
    db.commit()
