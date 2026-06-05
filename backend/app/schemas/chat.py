from pydantic import BaseModel


class ChatRequest(BaseModel):
    paper_id: int
    question: str


class ChatResponse(BaseModel):
    answer: str