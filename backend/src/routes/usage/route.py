import logging

from fastapi.responses import JSONResponse
from sqlalchemy import select
from src.routes.security import get_registered_user
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Users, TokenUsage

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/global")
async def get_global_token_usage(
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Create a new chat for the authenticated and registered user.
    """
    query = select(TokenUsage)
    result = await db.execute(query)
    usages = result.scalars().all()
    total_prompt_tokens = sum(usage.prompt_tokens for usage in usages)
    total_completion_tokens = sum(usage.completion_tokens for usage in usages)
    total_tokens = sum(usage.total_tokens for usage in usages)
    total_messages = sum(usage.message_count for usage in usages)
    new_chat_info = {
        "total_tokens": total_tokens,
        "total_messages": total_messages,
        "total_completion_tokens": total_completion_tokens,
        "total_prompt_tokens": total_prompt_tokens,
    }
    return JSONResponse(status_code=200, content=new_chat_info)


@router.get("/user")
async def get_user_token_usage(
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Return token usage for the authenticated user.
    """
    query = select(TokenUsage).where(TokenUsage.user_sub == user.sub)
    result = await db.execute(query)
    usage = result.scalars().first()
    if not usage:  ## fall back for no registered user
        return JSONResponse(
            status_code=200,
            content={
                "total_prompt_tokens": 0,
                "total_completion_tokens": 0,
                "total_tokens": 0,
                "total_messages": 0,
            },
        )

    return JSONResponse(
        status_code=200,
        content={
            "total_prompt_tokens": usage.prompt_tokens,
            "total_completion_tokens": usage.completion_tokens,
            "total_tokens": usage.total_tokens,
            "total_messages": usage.message_count,
        },
    )
