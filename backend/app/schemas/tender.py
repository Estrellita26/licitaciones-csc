from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from app.models.tender import StatusEnum
from app.schemas.client import ClientResponse
from app.schemas.product import ProductResponse

class TenderProductAdd(BaseModel):
    product_id: int
    quantity: int

class TenderProductResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    product: ProductResponse

    class Config:
        from_attributes = True

class TenderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    client_id: int
    max_budget: Decimal

class TenderStatusUpdate(BaseModel):
    status: StatusEnum

class TenderResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    client_id: int
    status: StatusEnum
    max_budget: Decimal
    total_amount: Decimal
    created_at: datetime
    client: Optional[ClientResponse] = None

    class Config:
        from_attributes = True

class TenderDetailResponse(TenderResponse):
    products: List[TenderProductResponse] = []

    class Config:
        from_attributes = True
