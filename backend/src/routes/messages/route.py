import logging
import os
from uuid import UUID

from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import selectinload
from src.routes.security import get_registered_user
from fastapi import APIRouter, Body, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import (
    Chats,
    Documents,
    Embeddings,
    TokenUsage,
    Users,
    Messages,
)
from src.routes.messages.models import NewMessageRequest
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from openai.types.chat import ChatCompletionChunk

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/message")
async def create_chat_message(
    request: NewMessageRequest = Body(...),
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Save a new message to a chat for the authenticated and registered user.
    """
    try:
        chat_uuid = UUID(request.chat_id)
    except ValueError:
        return JSONResponse(
            status_code=400, content={"error": "Invalid chat_id format"}
        )

    result = await db.execute(
        select(Chats).filter(Chats.id == chat_uuid, Chats.user_sub == user.sub)
    )
    chat = result.scalars().first()
    if not chat:
        return JSONResponse(
            status_code=404, content={"error": "Chat not found or access denied"}
        )

    new_message = Messages(
        chat_id=chat.id,
        content=request.message,
        sent_by_user=True,
        message_metadata=request.metadata,
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    # (Maybe TODO) Get the full chat history to load into the prompt

    # Get search documents
    user_message_vector = await open_ai_client_manager.run_embed(request.message)
    distance_label = Embeddings.vector.cosine_distance(user_message_vector).label(
        "distance"
    )
    stmt = (
        select(
            Embeddings.id,
            Embeddings.content,
            Documents.file_name,
            Documents.target_audience,
            distance_label,
        )
        .join(Documents, Embeddings.document_id == Documents.id)
        .order_by(distance_label)
        .limit(5)  # top 5 scores only
    )

    result = await db.execute(stmt)
    results = result.fetchall()
    matches = [
        {
            "document_id": str(row.id),
            "file_name": row.file_name,
            "similarity_score": float(
                1 - row.distance
            ),  # converts distance to similarity score
            "content_snippet": row.content if row.content else None,
            "target_audience": row.target_audience,
        }
        for row in results
    ]
    document_contents: str = ""
    for search_content in matches:
        document_contents += f"<{search_content.get("file_name", "failed to fetch title")} target_audience={search_content.get("target_audience", "")}>\n{search_content.get("content_snippet", "")}\n</{search_content.get("file_name", "failed to fetch title")}>\n\n"

    prompt_template = open_ai_client_manager.load_template("qa")
    stream = await open_ai_client_manager.run_streamed_prompt_template(
        request.message,
        template=prompt_template,
        variables={"search_content": document_contents},
    )

    async def process_stream():
        ai_response = ""
        prompt_tokens = 0
        completion_tokens = 0
        total_tokens = 0
        async for event in stream:
            if isinstance(event, ChatCompletionChunk):
                for choice in event.choices:
                    ai_response += choice.delta.content or ""
                    yield choice.delta.content or ""
            yield ""

            if event.usage:
                prompt_tokens = event.usage.prompt_tokens
                completion_tokens = event.usage.completion_tokens
                total_tokens = event.usage.total_tokens

        new_ai_message = Messages(
            chat_id=chat.id,
            content=ai_response,
            sent_by_user=False,
            message_metadata={},
        )

        db.add(new_ai_message)
        await db.commit()
        await db.refresh(new_ai_message)

        stmt = (
            insert(TokenUsage)
            .values(
                user_sub=user.sub,
                message_count=1,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
            )
            .on_conflict_do_update(
                index_elements=["user_sub"],
                set_={
                    "message_count": TokenUsage.message_count + 1,
                    "prompt_tokens": TokenUsage.prompt_tokens + prompt_tokens,
                    "completion_tokens": TokenUsage.completion_tokens
                    + completion_tokens,
                    "total_tokens": TokenUsage.total_tokens + total_tokens,
                    "updated_at": func.now(),
                },
            )
        )

        await db.execute(stmt)
        await db.commit()

    return StreamingResponse(process_stream(), media_type="text/event-stream")


@router.get("/{chat_id}")
async def get_chat_messages(
    chat_id: str,
    user: Users = Depends(get_registered_user),
    db: AsyncSession = Depends(db_manager.get_db),
):
    """
    Retrieve all messages for a chat belonging to the authenticated user.
    """
    try:
        chat_uuid = UUID(chat_id)
    except ValueError:
        return JSONResponse(
            status_code=400, content={"error": "Invalid chat_id format"}
        )

    result = await db.execute(
        select(Chats)
        .options(
            selectinload(Chats.messages)
        )  # eager load messages cannot lazy load like in sync scenario
        .filter(Chats.id == chat_uuid, Chats.user_sub == user.sub)
    )
    chat = result.scalars().first()
    if not chat:
        return JSONResponse(
            status_code=404, content={"error": "Chat not found or access denied"}
        )

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
        },
    )
