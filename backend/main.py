from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
from jose import JWTError, jwt

from sqlmodel import Field, Session, SQLModel, create_engine, select

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# --- Security Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123") # Use env var or hardcoded default
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Database Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is missing in .env")

engine = create_engine(DATABASE_URL, echo=True)

# --- Models ---

class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Optional[str] = None

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

# --- Database Functions ---

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# --- Security Functions ---

def verify_password(plain_password, hashed_password):
    plain_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def get_password_hash(password):
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15) # Default expiry
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    return user

async def authenticate_user(username: str, password: str, session: Session = Depends(get_session)):
    user = await get_user(username, session)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.username, session)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    # You can add user activation/deactivation logic here if needed
    # For now, just return the user
    return current_user

# --- FastAPI App ---

app = FastAPI(
    title="Todo API with Auth",
    version="0.1.0",
)

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:3000", # Allow frontend to access
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- Auth Endpoints ---

@app.post("/register", response_model=UserRead)
async def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == user_create.username)).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    hashed_password = get_password_hash(user_create.password)
    user = User(username=user_create.username, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = await authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Protected Task Endpoints ---

@app.get("/api/tasks", response_model=List[TaskRead])
async def read_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
    return tasks

@app.post("/api/tasks", response_model=TaskRead)
async def create_task(
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    db_task = Task.from_orm(task, update={"user_id": current_user.id}) # Assign task to current user
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/api/tasks/{task_id}", response_model=TaskRead)
async def read_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or does not belong to user")
    return db_task

@app.put("/api/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or does not belong to user")

    task_data = task.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or does not belong to user")

    session.delete(db_task)
    session.commit()
    return {"ok": True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)