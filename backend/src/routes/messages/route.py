import logging
from uuid import UUID

from fastapi.responses import JSONResponse
from src.routes.security import get_current_user, get_registered_user
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Chats, Users, Messages
from src.routes.messages.models import NewMessageRequest

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/message")
async def create_chat_message(
    request: NewMessageRequest = Body(...),
    user: Users = Depends(get_registered_user),
    db: Session = Depends(db_manager.get_db),
):
    """
    Save a new message to a chat for the authenticated and registered user.
    """
    try:
        chat_uuid = UUID(request.chat_id)
    except ValueError:
        return JSONResponse(status_code=400, content={"error": "Invalid chat_id format"})

    chat = db.query(Chats).filter(Chats.id == chat_uuid, Chats.user_sub == user.sub).first()
    if not chat:
        return JSONResponse(status_code=404, content={"error": "Chat not found or access denied"})

    new_message = Messages(
        chat_id=chat.id,
        content=request.message,
        sent_by_user=True,
        message_metadata=request.metadata
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return JSONResponse(
        status_code=200,
        content={
            "message_id": str(new_message.id),
            "chat_id": str(chat.id),
            "sent_by_user": new_message.sent_by_user,
            "content": new_message.content,
            "metadata": new_message.message_metadata,
            "created_at": new_message.created_at.isoformat()
        }
    )

@router.get("/{chat_id}")
async def get_chat_messages(
    chat_id: str,
    user: Users = Depends(get_registered_user),
    db: Session = Depends(db_manager.get_db),
):
    """
    Retrieve all messages for a chat belonging to the authenticated user.
    """
    try:
        chat_uuid = UUID(chat_id)
    except ValueError:
        return JSONResponse(status_code=400, content={"error": "Invalid chat_id format"})

    chat = db.query(Chats).filter(Chats.id == chat_uuid, Chats.user_sub == user.sub).first()
    if not chat:
        return JSONResponse(status_code=404, content={"error": "Chat not found or access denied"})

    messages_list = [
        {
            "message_id": str(msg.id),
            "sent_by_user": msg.sent_by_user,
            "content": msg.content,
            "metadata": msg.message_metadata,
            "created_at": msg.created_at.isoformat(),
        }
        for msg in chat.messages
    ]

    return JSONResponse(
        status_code=200,
        content={
            "chat_id": str(chat.id),
            "user_email": user.email,
            "messages": messages_list,
        }
    )