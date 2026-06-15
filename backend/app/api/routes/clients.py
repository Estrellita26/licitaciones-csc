from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.dependencies import get_current_user, require_admin
from app.schemas.client import ClientCreate, ClientResponse
from app.services.client_service import create_client, get_all_clients
from app.models.client import Client
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ClientResponse])
def list_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_clients(db, skip, limit)

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_new_client(client_data: ClientCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return create_client(db, client_data, current_user.id)

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    db.delete(client)
    db.commit()
