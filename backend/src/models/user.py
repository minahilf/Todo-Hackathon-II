from sqlmodel import Field, SQLModel
from typing import Optional

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str  # We store the HASH, so name it hashed_password

class UserCreate(UserBase):
    password: str  # User sends raw password

class UserRead(UserBase):
    id: int

class Token(SQLModel):
    access_token: str
    token_type: str