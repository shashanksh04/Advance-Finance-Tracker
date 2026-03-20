import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserOut
from ..utils.jwt_handler import get_current_user
from ..config import settings

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/", response_model=UserOut)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/upload-photo", response_model=UserOut)
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File uploaded is not an image.")

    upload_dir = settings.UPLOAD_DIR
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not save file.")

    current_user.profile_photo = f"/uploads/{file_name}"
    await db.commit()
    await db.refresh(current_user)

    return current_user
