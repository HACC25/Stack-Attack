import json
import logging
import os
from pathlib import Path
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from fastapi import APIRouter, Depends, HTTPException
from src.routes.open_ai.models import ChatRequest
from src.utils.pdf_parsing.page import load_pages
from src.utils.helper import is_json
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager
from src.utils.postgres.models import Documents, Embeddings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/demo")
async def chat_demo(request: ChatRequest):
    response = await open_ai_client_manager.get_chat_model(user_message=request.message)
    return {"response": response}


@router.post("/ingestion_demo")
async def sample_ingestion(db: Session = Depends(db_manager.get_db)):
    try:
        root = os.getcwd()
        ingestion_location = os.path.join(root, "src", ".files", "bargaining")
        prompt_template = open_ai_client_manager.load_template("ingestion")
        # Ensure folders exist
        os.makedirs(ingestion_location, exist_ok=True)

        for filename in os.listdir(ingestion_location):
            full_path = os.path.join(ingestion_location, filename)
            if not (os.path.isfile(full_path) and filename.lower().endswith(".pdf")):
                continue

            pages = load_pages(full_path)
            if not pages:
                logger.info(f"Skipping {filename}: no readable pages found.")
                continue

            response: str = await open_ai_client_manager.run_prompt_template(
                template=prompt_template,
                variables={"input": pages[0].content, "file_name": filename},
            )

            if not is_json(response):
                raise Exception(f"LLM Output was not JSON formatted --> {response}")

            response_json = json.loads(response)
            title = response_json.get("title")
            unit = response_json.get("unit")
            target_audience = response_json.get("target_audience")
            start_date = response_json.get("start_date")
            end_date = response_json.get("end_date")

            document = db.query(Documents).filter_by(file_name=filename).first()

            if document:
                updated = any(
                    [
                        document.title != title,
                        document.unit != unit,
                        document.target_audience != target_audience,
                        document.start_date != start_date,
                        document.end_date != end_date,
                    ]
                )

                if updated:
                    logger.info(f"Updating document: {filename}")
                    document.title = title
                    document.unit = unit
                    document.target_audience = target_audience
                    document.start_date = start_date
                    document.end_date = end_date
                    deleted_count = (
                        db.query(Embeddings).filter_by(document_id=document.id).delete()
                    )
                    logger.info(
                        f"Deleted {deleted_count} old embeddings for {filename}"
                    )
                else:
                    logger.info(
                        f"No metadata changes detected for {filename}; skipping re-embedding."
                    )
                    continue

            else:
                document = Documents(
                    file_name=filename,
                    title=title,
                    unit=unit,
                    target_audience=target_audience,
                    start_date=start_date,
                    end_date=end_date,
                )
                db.add(document)
                db.flush()  # Make sure document.id is available
                logger.info(f"Inserted new document: {filename}")

            for page_number, page in enumerate(pages, start=1):
                page_text = page.content.strip()
                if not page_text:
                    continue

                embedding_vector = await open_ai_client_manager.run_embed(page_text)
                if not embedding_vector:
                    logger.warning(
                        f"Embedding failed for page {page_number} in {filename}"
                    )
                    continue

                embedding_entry = Embeddings(
                    content=page_text,
                    vector=embedding_vector,
                    document_id=document.id,
                )
                db.add(embedding_entry)
                logger.info(f"Added embedding for page {page_number} in {filename}")

            db.commit()

        logger.info("Ingestion Process Completed Successfully")
        return {"message": "Ingestion process completed successfully."}

    except Exception as e:
        db.rollback()
        logger.error(f"Error during ingestion: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
