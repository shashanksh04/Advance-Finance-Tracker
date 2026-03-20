from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator('password')
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) > 72:
            raise ValueError("Password must be 72 characters or fewer")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    profile_photo: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenWithUser(Token):
    user: UserOut

class TokenData(BaseModel):
    user_id: str

