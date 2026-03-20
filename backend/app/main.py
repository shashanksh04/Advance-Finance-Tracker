import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import auth, transactions, dashboard, profile

# Create uploads directory before mounting
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Finance Tracker API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)
app.include_router(profile.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Finance Tracker API running"}
