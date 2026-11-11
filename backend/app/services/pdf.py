from io import BytesIO

from fastapi import HTTPException, UploadFile, status
from pypdf import PdfReader


async def extract_text_from_pdf(file: UploadFile) -> str:
    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded PDF is empty",
        )

    try:
        reader = PdfReader(BytesIO(content))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF file",
        ) from exc

    pages_text: list[str] = []
    for page in reader.pages:
        try:
            page_text = page.extract_text() or ""
            if page_text.strip():
                pages_text.append(page_text.strip())
        except Exception:
            # Пропускаем страницы которые не удалось прочитать
            continue

    full_text = "\n\n".join(pages_text)

    if not full_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from PDF. Make sure the PDF contains selectable text and is not a scanned image.",
        )

    return full_text