from pydantic import BaseModel
from datetime import datetime


class PaperResponse(BaseModel):
    id: int
    title: str
    filename: str
    summary: str | None
    created_at: datetime

    class Config:
        from_attributes = True