from sqlalchemy.orm import Session
from app.models.client import Client
from app.schemas.client import ClientCreate

def get_all_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Client).offset(skip).limit(limit).all()

def create_client(db: Session, client_data: ClientCreate, created_by_id: int):
    new_client = Client(
        name=client_data.name,
        email=client_data.email,
        phone=client_data.phone,
        created_by=created_by_id,
        updated_by=created_by_id
    )
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client
