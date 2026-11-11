from typing import Any

PROMPT_TEMPLATE = """Generate exactly {question_count} multiple choice quiz questions based on the following text.
Difficulty level: {difficulty}

Text:
{text}

Return ONLY a JSON array with this exact structure, no other text:
[
  {{
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Option A",
    "explanation": "Brief explanation why this is correct"
  }}
]"""


def _validate_questions(questions: Any) -> list[dict[str, Any]]:
    if not isinstance(questions, list):
        raise ValueError("Questions must be a list")

    validated = []
    for i, q in enumerate(questions):
        if not isinstance(q, dict):
            continue
        if "question" not in q or "options" not in q or "correct" not in q:
            continue
        if not isinstance(q["options"], list) or len(q["options"]) < 2:
            continue

        validated.append({
            "id": q.get("id", i + 1),
            "question": str(q["question"]),
            "options": [str(o) for o in q["options"]],
            "correct": str(q["correct"]),
            "explanation": str(q.get("explanation", "")),
        })

    if not validated:
        raise ValueError("No valid questions generated")

    return validated