import logging

from fastapi.responses import JSONResponse
from sqlalchemy import select
from src.routes.chats.models import AlterPinnedStatusRequest, DeleteRequest
from src.routes.security import get_registered_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Chats, Messages, Users

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/")
async def create_chat(
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Create a new chat for the authenticated and registered user.
    """
    new_chat = Chats(user_sub=user.sub, chat_title="New Chat")
    db.add(new_chat)
    await db.commit()
    await db.refresh(new_chat)

    default_message: str = "Aloha! 🌈 I’m Kōkua. Ask me about your employment benefits under UH collective bargaining agreements."

    new_ai_message = Messages(
        chat_id=new_chat.id,
        content=default_message,
        sent_by_user=False,
        message_metadata={},
    )

    db.add(new_ai_message)
    await db.commit()
    await db.refresh(new_ai_message)

    new_chat_info = {
        "title": f"chat_{new_chat.id}",  ## This is a temporary title to ensure one exists during chat creation (real title is created on first user message)
        "chat_id": str(new_chat.id),
        "user_email": user.email,
        "created_at": new_chat.created_at.isoformat(),
    }
    return JSONResponse(status_code=200, content=new_chat_info)


@router.get("/")
async def get_chats_for_user(
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Retrieve all chats for the authenticated and registered user.
    """
    stmt = select(Chats).where(Chats.user_sub == user.sub)
    result = await db.execute(stmt)
    chats = result.scalars().all()

    chat_list = [
        {
            "title": chat.chat_title,
            "chat_id": str(chat.id),
            "created_at": chat.created_at.isoformat(),
            "pinned": chat.pinned,
        }
        for chat in chats
    ]

    return JSONResponse(
        status_code=200, content={"user_email": user.email, "chats": chat_list}
    )

@router.post("/set-pinned-status")
async def set_pinned_status(
    request: AlterPinnedStatusRequest,
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db), 
):
    result = await db.execute(
        select(Chats).where(Chats.id == request.chat_id)
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.pinned = request.pinned

    await db.commit()
    await db.refresh(chat)

    return chat

@router.delete("/")
async def delete_chat(
    request: DeleteRequest,
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db), 
):
    result = await db.execute(
        select(Chats).where(Chats.id == request.chat_id)
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    await db.delete(chat)
    await db.commit()

    return JSONResponse(content={"status": "deleted"}, status_code=200)
