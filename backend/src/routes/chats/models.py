from pydantic import BaseModel

class AlterPinnedStatusRequest(BaseModel):
    chat_id: str
    pinned: bool
