from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate

def get_all_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def create_product(db: Session, product_data: ProductCreate, created_by_id: int):
    new_product = Product(
        name=product_data.name,
        sku=product_data.sku,
        unit_price=product_data.unit_price,
        created_by=created_by_id,
        updated_by=created_by_id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
