from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.dependencies.auth import get_current_user_id
from app.models.quiz import Quiz
from app.schemas.quiz import GenerateQuizRequest, QuizResponse, UploadResponse
from app.services.ai_providers import AIProviderFactory
from app.services.pdf import extract_text_from_pdf

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    _: UUID = Depends(get_current_user_id),
) -> UploadResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    extracted_text = await extract_text_from_pdf(file)
    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from PDF",
        )

    return UploadResponse(
        filename=file.filename,
        title=file.filename.rsplit(".", 1)[0],
        text_preview=extracted_text[:1000],
        full_text=extracted_text,
        extracted_characters=len(extracted_text),
    )


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    payload: GenerateQuizRequest,
    db: Session = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user_id),
) -> QuizResponse:
    print(f"[GENERATE] Starting for user {current_user_id}", flush=True)
    
    if len(payload.text.strip()) < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Extracted text is too short to generate a meaningful quiz",
        )

    provider_type = payload.provider or "lmstudio"

    if provider_type == "openai":
        if not settings.openai_api_key2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenAI API key not configured. Please set OPENAI_API_KEY2 in environment.",
            )
        config = {
            "api_key": settings.openai_api_key2,
            "model": settings.openai_model,
        }
    else:
        if not settings.openai_base_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="LM Studio base URL not configured.",
            )
        config = {
            "base_url": settings.openai_base_url,
            "api_key": settings.openai_api_key,
            "model": settings.openai_model,
        }

    try:
        print(f"[DEBUG] Creating provider: type={provider_type}, config={config}", flush=True)
        provider = AIProviderFactory.create_provider(provider_type, config)
        print(f"[DEBUG] Provider created: {provider.get_provider_name()}", flush=True)
        questions = provider.generate_quiz_questions(
            text=payload.text,
            question_count=payload.question_count,
            difficulty=payload.difficulty,
        )
        print(f"[DEBUG] Questions generated: {len(questions)}", flush=True)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[DEBUG] Exception in provider: {str(e)}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to generate quiz: {str(e)}",
        ) from e

    try:
        print(f"[DB] Saving quiz for user {current_user_id}", flush=True)
        quiz = Quiz(
            user_id=current_user_id,
            title=payload.title,
            questions=questions,
        )
        db.add(quiz)
        db.commit()
        print(f"[DB] Quiz saved successfully", flush=True)
        db.refresh(quiz)
        return quiz
    except Exception as e:
        print(f"[DB ERROR] {str(e)}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        ) from e


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: UUID,
    db: Session = Depends(get_db),
    _: UUID = Depends(get_current_user_id),
) -> QuizResponse:
    quiz = db.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return quiz