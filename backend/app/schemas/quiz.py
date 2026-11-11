from typing import Any, Optional
from uuid import UUID
from pydantic import BaseModel


class UploadResponse(BaseModel):
    filename: str
    title: str
    text_preview: str
    full_text: str
    extracted_characters: int


class GenerateQuizRequest(BaseModel):
    title: str
    text: str
    question_count: int = 5
    difficulty: str = "medium"
    provider: Optional[str] = "openai"


class QuizResponse(BaseModel):
    id: UUID
    title: str
    questions: list[dict[str, Any]]

    class Config:
        from_attributes = True