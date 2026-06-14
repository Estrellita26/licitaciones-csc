import os

def w(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"OK: {path}")

w("app/core/security.py", [
    "from datetime import datetime, timedelta, timezone",
    "from jose import JWTError, jwt",
    "from passlib.context import CryptContext",
    "from app.core.config import settings",
    "",
    'pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")',
    "",
    "def hash_password(password: str) -> str:",
    "    return pwd_context.hash(password)",
    "",
    "def verify_password(plain_password: str, hashed_password: str) -> bool:",
    "    return pwd_context.verify(plain_password, hashed_password)",
    "",
    "def create_access_token(data: dict) -> str:",
    "    to_encode = data.copy()",
    "    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)",
    '    to_encode.update({"exp": expire})',
    "    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)",
    "",
    "def decode_access_token(token: str):",
    "    try:",
    "        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])",
    "        return payload",
    "    except JWTError:",
    "        return None",
])

w("app/core/database.py", [
    "from sqlalchemy import create_engine",
    "from sqlalchemy.orm import sessionmaker, declarative_base",
    "from app.core.config import settings",
    "",
    "engine = create_engine(settings.DATABASE_URL)",
    "SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)",
    "Base = declarative_base()",
    "",
    "def get_db():",
    "    db = SessionLocal()",
    "    try:",
    "        yield db",
    "    finally:",
    "        db.close()",
])

w("app/core/__init__.py", [""])
w("app/__init__.py", [""])
w("app/api/__init__.py", [""])
w("app/api/routes/__init__.py", [""])
w("app/schemas/__init__.py", [""])
w("app/services/__init__.py", [""])
w("app/models/__init__.py", [
    "from app.models.user import User",
    "from app.models.client import Client",
    "from app.models.product import Product",
    "from app.models.tender import Tender, TenderProduct",
])

print("\nArchivos core escritos correctamente!")
