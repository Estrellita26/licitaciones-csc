from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.schemas.tender import TenderCreate, TenderResponse, TenderDetailResponse, TenderStatusUpdate, TenderProductAdd
from app.services.tender_service import (
    get_all_tenders,
    get_tender_by_id,
    create_tender,
    update_tender_status,
    add_product_to_tender
)
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[TenderResponse])
def list_tenders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_tenders(db, skip, limit)

@router.post("/", response_model=TenderResponse, status_code=status.HTTP_201_CREATED)
def create_new_tender(
    tender_data: TenderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return create_tender(db, tender_data, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

@router.get("/{tender_id}", response_model=TenderDetailResponse)
def get_tender(
    tender_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tender = get_tender_by_id(db, tender_id)
    if not tender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Licitacion no encontrada"
        )
    return tender

@router.patch("/{tender_id}/status", response_model=TenderResponse)
def change_tender_status(
    tender_id: int,
    status_data: TenderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return update_tender_status(db, tender_id, status_data, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

@router.post("/{tender_id}/products", response_model=TenderDetailResponse, status_code=status.HTTP_201_CREATED)
def add_product(
    tender_id: int,
    product_data: TenderProductAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return add_product_to_tender(db, tender_id, product_data, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
