from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    sender: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
