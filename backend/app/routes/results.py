from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from uuid import UUID
import uuid

from app.db.database import get_db
from app.models.result import Result
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/api/results", tags=["results"])


class AnswerItem(BaseModel):
    question_id: int
    selected: str
    correct: str
    is_correct: bool


class SubmitResultRequest(BaseModel):
    quiz_id: UUID
    score: int
    total: int
    answers: List[AnswerItem]


class ResultResponse(BaseModel):
    id: UUID
    quiz_id: UUID
    score: int
    total: int
    percentage: float
    completed_at: str

    class Config:
        from_attributes = True


@router.post("/submit", response_model=ResultResponse)
def submit_result(
    data: SubmitResultRequest,
    db: Session = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user_id)
):
    result = Result(
        id=uuid.uuid4(),
        user_id=current_user_id,
        quiz_id=data.quiz_id,
        score=data.score,
        total=data.total,
        answers=[a.dict() for a in data.answers]
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return ResultResponse(
        id=result.id,
        quiz_id=result.quiz_id,
        score=result.score,
        total=result.total,
        percentage=round((result.score / result.total) * 100, 1),
        completed_at=str(result.completed_at)
    )


@router.get("/{user_id}", response_model=List[ResultResponse])
def get_results(
    user_id: UUID,
    db: Session = Depends(get_db),
    _: UUID = Depends(get_current_user_id)
):
    results = db.query(Result).filter(Result.user_id == user_id).order_by(Result.completed_at.desc()).all()

    return [
        ResultResponse(
            id=r.id,
            quiz_id=r.quiz_id,
            score=r.score,
            total=r.total,
            percentage=round((r.score / r.total) * 100, 1),
            completed_at=str(r.completed_at)
        )
        for r in results
    ]