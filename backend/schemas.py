from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class ReceiptItemBase(BaseModel):
    name: str
    price: float
    quantity: int = 1
    category: Optional[str] = None


class ReceiptItemCreate(ReceiptItemBase):
    pass


class ReceiptItemOut(ReceiptItemBase):
    id: int
    receipt_id: int

    class Config:
        from_attributes = True


class ReceiptBase(BaseModel):
    store_name: Optional[str] = None
    purchase_date: Optional[date] = None
    total_amount: Optional[float] = None


class ReceiptCreate(ReceiptBase):
    raw_text: Optional[str] = None
    image_path: Optional[str] = None
    items: list[ReceiptItemCreate] = []


class ReceiptOut(ReceiptBase):
    id: int
    image_path: Optional[str] = None
    created_at: datetime
    items: list[ReceiptItemOut] = []

    class Config:
        from_attributes = True


class ReceiptListItem(ReceiptBase):
    id: int
    created_at: datetime
    item_count: int = 0

    class Config:
        from_attributes = True


class SpendByCategory(BaseModel):
    category: str
    total: float


class UploadResponse(BaseModel):
    receipt: ReceiptOut
    message: str
