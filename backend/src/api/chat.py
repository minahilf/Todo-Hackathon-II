from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from pydantic import BaseModel
from src.db import get_session
from src.models.user import User
from src.models.conversation import Conversation
from src.models.message import Message
from src.services.ai_agent import get_chat_response
from src.services.auth import get_current_active_user # Import get_current_active_user
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    user_id = current_user.id

    conversation: Optional[Conversation] = None
    if request.conversation_id:
        conversation = session.exec(select(Conversation).where(
            Conversation.id == request.conversation_id,
            Conversation.user_id == user_id
        )).first()
        if not conversation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if not conversation:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    user_message = Message(
        conversation_id=conversation.id,
        sender="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    session.add(user_message)
    session.commit()

    message_history_db = session.exec(select(Message).where(
        Message.conversation_id == conversation.id
    ).order_by(Message.timestamp)).all()

    # Format history for Google Gemini Tool Calling
    history_for_ai = []
    for msg in message_history_db:
        role = "user" if msg.sender == "user" else "model"
        history_for_ai.append({"role": role, "parts": [{"text": msg.content}]})

    # Call AI agent with user_id and full history
    ai_response_content = await get_chat_response(user_id, history_for_ai)

    ai_message = Message(
        conversation_id=conversation.id,
        sender="bot", # In DB, we still use 'bot'
        content=ai_response_content,
        timestamp=datetime.utcnow()
    )
    session.add(ai_message)
    session.commit()
    session.refresh(ai_message)

    return ChatResponse(response=ai_response_content, conversation_id=conversation.id)
