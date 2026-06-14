from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum, Text, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class StatusEnum(str, enum.Enum):
    activa = "activa"
    por_cobrar = "por_cobrar"
    perdida = "perdida"
    finalizada = "finalizada"

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.activa)
    max_budget = Column(Numeric(12, 2), nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    client = relationship("Client", foreign_keys=[client_id])
    products = relationship("TenderProduct", back_populates="tender")

class TenderProduct(Base):
    __tablename__ = "tender_products"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)

    tender = relationship("Tender", back_populates="products")
    product = relationship("Product", foreign_keys=[product_id])

    __table_args__ = (
        UniqueConstraint("tender_id", "product_id", name="uq_tender_product"),
    )
