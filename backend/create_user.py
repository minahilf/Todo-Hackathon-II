import os
import bcrypt
from sqlmodel import SQLModel, Session, create_engine, select
from src.models.user import User
from src.db import engine, get_session, create_db_and_tables # Import create_db_and_tables

# Copied get_password_hash from main.py to avoid circular dependency
def get_password_hash(password):
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def create_admin_user():
    print("Creating admin user...")

    # Ensure tables are created before seeding user
    create_db_and_tables()

    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.username == "admin")).first()
        if existing_user:
            print("User 'admin' already exists. Skipping creation.")
            return

        hashed_password = get_password_hash("password123")
        admin_user = User(username="admin", hashed_password=hashed_password)

        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)
        print(f"User '{admin_user.username}' created successfully with ID: {admin_user.id}!")

if __name__ == "__main__":
    create_admin_user()
