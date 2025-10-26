import json
import logging
import os
from pathlib import Path
from src.utils.open_ai.open_ai_client_manager import open_ai_client_manager
from fastapi import APIRouter, HTTPException
from src.routes.open_ai.models import ChatRequest
from src.utils.pdf_parsing.page import load_pages
from src.utils.helper import is_json

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/demo")
async def chat_demo(request: ChatRequest):
    response = await open_ai_client_manager.get_chat_model(user_message=request.message)
    return {"response": response}


@router.post("/ingestion_demo")
async def sample_ingestion():
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
                    print(f"Skipping {filename}: no readable text found on first page.")
                    continue
                response: str = await open_ai_client_manager.run_prompt_template(
                    template=prompt_template,
                    variables={"input": pages[0].content, "file_name": filename},
                )
                if is_json(response):
                    response_json: dict = json.loads(response)
                    output_json_path = os.path.join(
                        output_location, f"{Path(filename).stem}.json"
                    )
                    with open(output_json_path, "w", encoding="utf-8") as f:
                        json.dump(response_json, f, ensure_ascii=False, indent=4)
                    # print(f"Saved JSON output to: {output_json_path}")
                else:
                    raise Exception(f"LLM Output was not JSON formatted --> {response}")

        print("Ingestion Process Completed Without Error")
    except Exception as e:
        print(f"Error occurred during the Ingestion Process! {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
