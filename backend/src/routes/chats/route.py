import logging

from fastapi.responses import JSONResponse
from src.routes.security import get_registered_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Chats, Users

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/")
async def create_chat(
    user: Users = Depends(get_registered_user),
    db: Session = Depends(db_manager.get_db),
):
    """
    Create a new chat for the authenticated and registered user.
    """
    new_chat = Chats(user_sub=user.sub)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    new_chat_info = {
        "chat_id": str(new_chat.id),
        "user_email": user.email,
        "created_at": new_chat.created_at.isoformat(),
    }
    return JSONResponse(status_code=200, content=new_chat_info)


@router.get("/")
async def get_chats_for_user(
    user: Users = Depends(get_registered_user),
    db: Session = Depends(db_manager.get_db),
):
    """
    Retrieve all chats for the authenticated and registered user.
    """
    chats = db.query(Chats).filter(Chats.user_sub == user.sub).all()

    chat_list = [
        {
            "chat_id": str(chat.id),
            "created_at": chat.created_at.isoformat(),
        }
        for chat in chats
    ]

    return JSONResponse(
        status_code=200, content={"user_email": user.email, "chats": chat_list}
    )
