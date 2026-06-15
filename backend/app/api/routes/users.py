from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.dependencies import require_admin
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user, get_all_users
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return get_all_users(db)

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    try:
        return create_user(db, user_data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No puedes eliminarte a ti mismo")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
