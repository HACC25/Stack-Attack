from pydantic import BaseModel

class AlterPinnedStatusRequest(BaseModel):
    chat_id: str

class DeleteRequest(BaseModel):
    chat_id: str