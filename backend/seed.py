from app.core.database import SessionLocal
from app.models.user import User, RoleEnum
from app.core.security import hash_password

def seed():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@csc.com").first()
        if existing:
            print("El usuario admin ya existe")
            return
        admin = User(
            name="Administrador",
            email="admin@csc.com",
            password_hash=hash_password("admin123"),
            role=RoleEnum.admin
        )
        db.add(admin)
        db.commit()
        print("Usuario admin creado exitosamente")
        print("   Email: admin@csc.com")
        print("   Password: admin123")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
