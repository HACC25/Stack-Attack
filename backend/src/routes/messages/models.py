from typing import Optional
from pydantic import BaseModel

class NewMessageRequest(BaseModel):
    chat_id: str
    message: str
    metadata: Optional[dict] = None