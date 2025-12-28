from typing import Optional
from sqlmodel import Field, SQLModel

class TaskBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id") # Link task to a user

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    completed: bool

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
