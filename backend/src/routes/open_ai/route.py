import logging
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from fastapi import APIRouter
from src.routes.open_ai.models import ChatRequest

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/demo")
async def chat_demo(request: ChatRequest):
    response = open_ai_client_manager.get_chat_model(user_message=request.message)
    return {"response": response}
