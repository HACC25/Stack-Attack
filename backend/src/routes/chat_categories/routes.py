import logging

from fastapi.responses import JSONResponse
from sqlalchemy import select
from src.routes.security import get_registered_user
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Users, Documents

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
async def get_global_token_usage(
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Get a list of audiences categories
    """
    query = select(Documents)
    result = await db.execute(query)
    documents = result.scalars().all()
    audience_categories = [document.target_audience for document in documents if document.target_audience is not None]
    category_info = {
        "audiences": audience_categories,
    }
    return JSONResponse(status_code=200, content=category_info)
