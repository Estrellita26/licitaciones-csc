from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, clients, products, tenders

app = FastAPI(
    title="Sistema de Gestion de Licitaciones",
    description="API para gestion de licitaciones comerciales - CSC",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Autenticacion"])
app.include_router(users.router, prefix="/api/users", tags=["Usuarios"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clientes"])
app.include_router(products.router, prefix="/api/products", tags=["Productos"])
app.include_router(tenders.router, prefix="/api/tenders", tags=["Licitaciones"])

@app.get("/")
def root():
    return {"message": "Sistema de Gestion de Licitaciones - CSC API"}
