from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_data: UserCreate, created_by_id: int):
    existing = get_user_by_email(db, user_data.email)
    if existing:
        raise ValueError("El email ya esta registrado")
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        created_by=created_by_id,
        updated_by=created_by_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
