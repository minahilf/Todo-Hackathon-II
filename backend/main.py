from typing import Optional, List, AsyncIterator
from datetime import datetime, timedelta
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Field, Session, select, SQLModel

# Correct Imports
from src.models.user import User, UserCreate, UserRead, Token
from src.services.auth import (
    create_access_token,
    get_current_active_user,
    verify_password,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate
from src.models.conversation import Conversation
from src.models.message import Message
from src.api import chat
from src.db import create_db_and_tables, get_session

# Load Env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    print("Creating tables...")
    create_db_and_tables()
    yield
    print("Tables created.")

app = FastAPI(
    title="Todo API with Auth",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Setup
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")

# --- AUTH ENDPOINTS ---

# FIX 1: URL change kiya -> /api/register
@app.post("/api/register", response_model=UserRead)
async def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user_create.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = get_password_hash(user_create.password)
    db_user = User(username=user_create.username, hashed_password=hashed_pw)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Note: Token endpoint root par hi theek hai (/token) kyunki Frontend wahi dhoond raha hai
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# FIX 2: Ye MISSING Endpoint Add Kiya (Iske bina Login ke baad error aata hai)
@app.get("/api/users/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# --- TASK ENDPOINTS ---

@app.get("/api/tasks", response_model=List[TaskRead])
async def read_tasks(session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
    return tasks

@app.post("/api/tasks", response_model=TaskRead)
async def create_task(task: TaskCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    db_task = Task.from_orm(task, update={"user_id": current_user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/api/tasks/{task_id}", response_model=TaskRead)
async def read_task(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return db_task

@app.put("/api/tasks/{task_id}", response_model=TaskRead)
async def update_task(task_id: int, task: TaskUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task_data = task.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    session.delete(db_task)
    session.commit()
    return {"ok": True}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)