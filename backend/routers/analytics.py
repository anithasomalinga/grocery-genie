from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Receipt, ReceiptItem
from schemas import SpendByCategory

router = APIRouter()


@router.get("/spend-by-category", response_model=list[SpendByCategory])
def spend_by_category(
    months: Optional[int] = Query(None, description="Limit to last N months"),
    db: Session = Depends(get_db),
):
    query = db.query(
        ReceiptItem.category,
        func.sum(ReceiptItem.price).label("total"),
    ).join(Receipt, ReceiptItem.receipt_id == Receipt.id)

    if months:
        cutoff = datetime.utcnow() - timedelta(days=months * 30)
        query = query.filter(Receipt.created_at >= cutoff)

    rows = (
        query
        .group_by(ReceiptItem.category)
        .order_by(func.sum(ReceiptItem.price).desc())
        .all()
    )

    return [
        SpendByCategory(category=row.category or "Uncategorized", total=round(row.total, 2))
        for row in rows
    ]


@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    total_receipts = db.query(func.count(Receipt.id)).scalar()
    total_spend = db.query(func.sum(Receipt.total_amount)).scalar() or 0.0
    total_items = db.query(func.count(ReceiptItem.id)).scalar()
    return {
        "total_receipts": total_receipts,
        "total_spend": round(total_spend, 2),
        "total_items": total_items,
    }
