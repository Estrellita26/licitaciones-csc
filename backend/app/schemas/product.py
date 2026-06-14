from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    sku: str
    unit_price: Decimal

class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    unit_price: Decimal
    created_at: datetime

    class Config:
        from_attributes = True
