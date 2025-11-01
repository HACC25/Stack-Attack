import logging
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from fastapi import APIRouter, Body, Depends, HTTPException
from src.routes.postgres.models import ChatRequest
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Documents, Embeddings
from sqlalchemy import select

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/query-db-search-demo")
async def db_search_demo(
    request: ChatRequest = Body(...),
    db: Session = Depends(db_manager.get_db),
    top_k: int = 5,
):
    """
    Given a text query, find top N most similar document embeddings.
    """
    try:
        user_message_vector = await open_ai_client_manager.run_embed(request.message)

        # Query pgvector using cosine distance (<=>) Use table image on link https://www.tigerdata.com/learn/using-pgvector-with-python for more info
        stmt = (
            select(
                Embeddings.id,
                Embeddings.content,
                Documents.file_name,
                Embeddings.vector.cosine_distance(user_message_vector).label("distance")
            )
            .join(Documents, Embeddings.document_id == Documents.id)
            .order_by("distance")
            .limit(top_k)
        )

        results = db.execute(stmt).fetchall()
        matches = [
            {
                "document_id": str(row.id),
                "file_name": row.file_name,
                "similarity_score": float(1 - row.distance),  # converts distance to similarity score
                "content_snippet": row.content[:200] if row.content else None,
            }
            for row in results
        ]

        return matches

    except Exception as e:
        db.rollback()
        logger.exception("Error during DB search demo")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
