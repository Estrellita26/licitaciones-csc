# Sistema de Gestión de Licitaciones — CSC



## Despliegue

- **Frontend:** https://zingy-horse-e5a99c.netlify.app
- **Backend API:** https://licitaciones-csc-api.onrender.com
- **Documentación API (Swagger):** https://licitaciones-csc-api.onrender.com/docs

## Credenciales de prueba

- **Email:** admin@csc.com
- **Password:** admin123

## Stack Tecnológico

- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite
- **Base de datos:** PostgreSQL (Neon)
- **ORM:** SQLAlchemy + Alembic
- **Autenticación:** JWT + bcrypt
- **Deploy Backend:** Render
- **Deploy Frontend:** Netlify

## Instalación Local

### Requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
```

Crea el archivo `backend/.env`:
```env
DATABASE_URL=postgresql://usuario:password@host/dbname
JWT_SECRET=tu_clave_secreta
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=480
```

```bash
alembic upgrade head
python seed.py
uvicorn main:app --reload
```

API disponible en: http://localhost:8000
Swagger en: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
```

Crea el archivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend disponible en: http://localhost:5173

## Estructura del Proyecto

```
licitaciones-csc/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dependencies.py
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── clients.py
│   │   │       ├── products.py
│   │   │       └── tenders.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── client.py
│   │   │   ├── product.py
│   │   │   └── tender.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── client.py
│   │   │   ├── product.py
│   │   │   └── tender.py
│   │   └── services/
│   │       ├── user_service.py
│   │       ├── client_service.py
│   │       ├── product_service.py
│   │       └── tender_service.py
│   ├── alembic/
│   ├── main.py
│   ├── seed.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## Endpoints de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/auth/login | Login | Público |
| GET | /api/users | Listar usuarios | Admin |
| POST | /api/users | Crear usuario | Admin |
| GET | /api/clients | Listar clientes | Todos |
| POST | /api/clients | Crear cliente | Admin |
| GET | /api/products | Listar productos | Todos |
| POST | /api/products | Crear producto | Admin |
| GET | /api/tenders | Listar licitaciones | Todos |
| POST | /api/tenders | Crear licitación | Todos |
| GET | /api/tenders/:id | Detalle licitación | Todos |
| PATCH | /api/tenders/:id/status | Cambiar estado | Todos |
| POST | /api/tenders/:id/products | Agregar producto | Todos |

## Reglas de Negocio Implementadas

- Solo admins pueden crear usuarios, clientes y productos
- El presupuesto máximo debe ser mayor a 0
- No se pueden agregar productos a licitaciones no activas
- El total no puede superar el presupuesto máximo
- Estados terminales (finalizada, perdida) no pueden transicionar
- Combinación tender_id + product_id es única
- Email de usuario es único

## Variables de Entorno

Ver `backend/.env.example` para la lista completa de variables requeridas.
