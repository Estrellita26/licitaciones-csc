from sqlalchemy.orm import Session, joinedload
from app.models.tender import Tender, TenderProduct, StatusEnum
from app.models.product import Product
from app.models.client import Client
from app.schemas.tender import TenderCreate, TenderStatusUpdate, TenderProductAdd
from decimal import Decimal

VALID_TRANSITIONS = {
    StatusEnum.activa: [StatusEnum.por_cobrar, StatusEnum.perdida],
    StatusEnum.por_cobrar: [StatusEnum.finalizada],
    StatusEnum.finalizada: [],
    StatusEnum.perdida: [],
}

def get_all_tenders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tender).options(
        joinedload(Tender.client)
    ).offset(skip).limit(limit).all()

def get_tender_by_id(db: Session, tender_id: int):
    return db.query(Tender).options(
        joinedload(Tender.client),
        joinedload(Tender.products).joinedload(TenderProduct.product)
    ).filter(Tender.id == tender_id).first()

def create_tender(db: Session, tender_data: TenderCreate, created_by_id: int):
    if tender_data.max_budget <= 0:
        raise ValueError("El presupuesto maximo debe ser mayor a 0")
    client = db.query(Client).filter(Client.id == tender_data.client_id).first()
    if not client:
        raise ValueError("El cliente especificado no existe")
    new_tender = Tender(
        title=tender_data.title,
        description=tender_data.description,
        client_id=tender_data.client_id,
        max_budget=tender_data.max_budget,
        total_amount=Decimal("0"),
        status=StatusEnum.activa,
        created_by=created_by_id,
        updated_by=created_by_id
    )
    db.add(new_tender)
    db.commit()
    db.refresh(new_tender)
    return new_tender

def update_tender_status(db: Session, tender_id: int, status_data: TenderStatusUpdate, updated_by_id: int):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise ValueError("Licitacion no encontrada")
    allowed = VALID_TRANSITIONS.get(tender.status, [])
    if status_data.status not in allowed:
        raise ValueError(
            f"Transicion no permitida: no se puede cambiar de '{tender.status}' a '{status_data.status}'"
        )
    tender.status = status_data.status
    tender.updated_by = updated_by_id
    db.commit()
    db.refresh(tender)
    return tender

def add_product_to_tender(db: Session, tender_id: int, product_data: TenderProductAdd, updated_by_id: int):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise ValueError("Licitacion no encontrada")
    if tender.status != StatusEnum.activa:
        raise ValueError("No se pueden agregar productos a una licitacion no activa")
    product = db.query(Product).filter(Product.id == product_data.product_id).first()
    if not product:
        raise ValueError("El producto especificado no existe")
    existing = db.query(TenderProduct).filter(
        TenderProduct.tender_id == tender_id,
        TenderProduct.product_id == product_data.product_id
    ).first()
    if existing:
        raise ValueError("Este producto ya fue agregado a la licitacion")
    subtotal = Decimal(str(product.unit_price)) * product_data.quantity
    new_total = Decimal(str(tender.total_amount)) + subtotal
    if new_total > Decimal(str(tender.max_budget)):
        available = Decimal(str(tender.max_budget)) - Decimal(str(tender.total_amount))
        raise ValueError(
            f"El total excede el presupuesto maximo de ${tender.max_budget}. Disponible: ${available}"
        )
    tender_product = TenderProduct(
        tender_id=tender_id,
        product_id=product_data.product_id,
        quantity=product_data.quantity,
        unit_price=product.unit_price
    )
    db.add(tender_product)
    tender.total_amount = new_total
    tender.updated_by = updated_by_id
    db.commit()
    db.refresh(tender)
    return get_tender_by_id(db, tender_id)
