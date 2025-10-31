


import json
import logging
import os
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from fastapi import APIRouter, Depends, HTTPException, Body
from src.routes.postgres.models import ChatRequest
from src.utils.pdf_parsing.page import load_pages
from src.utils.helper import is_json
from sqlalchemy.orm import Session
from src.utils.postgres.connection_handler import db_manager

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/document_search_demo")
async def document_search_demo(request: ChatRequest = Body(...), db: Session = Depends(db_manager.get_db)):
    try:
        root = os.getcwd()  # Project Root ([...]\HACC_2025\Stack-Attack\backend)
        ingestion_location = os.path.join(root, "src", ".files", "bargaining")
        prompt_template = open_ai_client_manager.load_template("ingestion")
        output_location = os.path.join(ingestion_location, "llm_outputs")

        ## Ensure the output and injection folder exists folder exists!
        os.makedirs(ingestion_location, exist_ok=True)
        os.makedirs(output_location, exist_ok=True)

        for filename in os.listdir(ingestion_location):
            full_path = os.path.join(ingestion_location, filename)
            if os.path.isfile(full_path) and filename.lower().endswith(".pdf"):
                pages = load_pages(full_path)  ## TODO: Run async-like to avoid blocking
                if not pages or not pages[0].content.strip():  ## skip empty pages
                    logger.info(
                        f"Skipping {filename}: no readable text found on first page."
                    )
                    continue
                response: str = await open_ai_client_manager.run_prompt_template(
                    template=prompt_template,
                    variables={"input": pages[0].content, "file_name": filename},
                )
            if not is_json(response):
                raise Exception(f"LLM Output was not JSON formatted --> {response}")

            response_json: dict = json.loads(response)
            title = response_json.get("title")
            unit = response_json.get("unit")
            target_audience = response_json.get("target_audience")
            start_date = response_json.get("start_date")
            end_date = response_json.get("end_date")

            existing_doc = db.query(Documents).filter_by(file_name=filename).first()
            if existing_doc:
                existing_doc.title = title
                existing_doc.unit = unit
                existing_doc.target_audience = target_audience
                existing_doc.start_date = start_date
                existing_doc.end_date = end_date
                logger.info(f"Updated document: {filename}")
            else:
                new_doc = Documents(
                    file_name=filename,
                    title=title,
                    unit=unit,
                    target_audience=target_audience,
                    start_date=start_date,
                    end_date=end_date,
                )
                db.add(new_doc)
                logger.info(f"Inserted new document: {filename}")

            db.commit()

        logger.info("Ingestion Process Completed Successfully")
        return {"message": "Ingestion process completed successfully."}
    except Exception as e:
        logger.error(f"Error occurred during the Ingestion Process! {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")