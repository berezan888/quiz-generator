from typing import Any
from abc import ABC, abstractmethod
import json

from fastapi import HTTPException, status


class AIProvider(ABC):
    """Abstract base class for AI providers"""

    @abstractmethod
    def generate_quiz_questions(
        self, text: str, question_count: int, difficulty: str
    ) -> list[dict[str, Any]]:
        """Generate quiz questions using the AI provider"""
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        """Get the name of the provider"""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI API provider"""

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        from groq import Groq
        self.client = Groq(api_key=api_key)
        self.model = model

    def generate_quiz_questions(
        self, text: str, question_count: int, difficulty: str
    ) -> list[dict[str, Any]]:
        from app.services.quiz_generator import PROMPT_TEMPLATE, _validate_questions

        prompt = PROMPT_TEMPLATE.format(
            question_count=question_count,
            difficulty=difficulty,
            text=text[:15000],
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Return only valid JSON."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
            )
            raw_text = response.choices[0].message.content or "[]"

            # Clean up potential markdown code blocks
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0]

            # Extract JSON
            json_start = -1
            for i, char in enumerate(raw_text):
                if char in ["[", "{"]:
                    json_start = i
                    break

            if json_start > 0:
                raw_text = raw_text[json_start:]

            json_end = -1
            for i in range(len(raw_text) - 1, -1, -1):
                if raw_text[i] in ["]", "}"]:
                    json_end = i + 1
                    break

            if json_end > 0:
                raw_text = raw_text[:json_end]

            questions = json.loads(raw_text)
            return _validate_questions(questions)

        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"OpenAI returned invalid JSON: {str(exc)}",
            ) from exc
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Invalid quiz structure from OpenAI: {exc}",
            ) from exc
        except Exception as exc:
            error_msg = str(exc)
            # Check for specific OpenAI errors
            if "invalid_api_key" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid OpenAI API key. Please check your OPENAI_API_KEY2 configuration.",
                ) from exc
            elif "model_not_found" in error_msg.lower() or "invalid model" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"OpenAI model '{self.model}' not available. Please check your API access or try a different model.",
                ) from exc
            elif "insufficient_quota" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="OpenAI API quota exceeded. Please check your account billing.",
                ) from exc
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"OpenAI request failed: {error_msg}",
                ) from exc

    def get_provider_name(self) -> str:
        return "OpenAI"


class LMStudioProvider(AIProvider):
    """LM Studio local provider"""

    def __init__(self, base_url: str, api_key: str, model: str):
        from openai import OpenAI

        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model

    def generate_quiz_questions(
        self, text: str, question_count: int, difficulty: str
    ) -> list[dict[str, Any]]:
        from app.services.quiz_generator import PROMPT_TEMPLATE, _validate_questions

        prompt = PROMPT_TEMPLATE.format(
            question_count=question_count,
            difficulty=difficulty,
            text=text[:15000],
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Return only valid JSON."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
            )
            raw_text = response.choices[0].message.content or "[]"

            # Clean up LM Studio's extra tokens
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0]

            # Extract JSON
            json_start = -1
            for i, char in enumerate(raw_text):
                if char in ["[", "{"]:
                    json_start = i
                    break

            if json_start > 0:
                raw_text = raw_text[json_start:]

            json_end = -1
            for i in range(len(raw_text) - 1, -1, -1):
                if raw_text[i] in ["]", "}"]:
                    json_end = i + 1
                    break

            if json_end > 0:
                raw_text = raw_text[:json_end]

            questions = json.loads(raw_text)
            return _validate_questions(questions)

        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LM Studio returned invalid JSON: {str(exc)}",
            ) from exc
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Invalid quiz structure from LM Studio: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"LM Studio request failed: {str(exc)}",
            ) from exc

    def get_provider_name(self) -> str:
        return "LM Studio"


class AIProviderFactory:
    """Factory for creating AI providers"""

    @staticmethod
    def create_provider(provider_type: str, config: dict[str, str]) -> AIProvider:
        """Create an AI provider based on type"""
        if provider_type == "openai":
            api_key = config.get("api_key")
            if not api_key:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="OpenAI API key not configured",
                )
            model = config.get("model", "gpt-4o-mini")
            return OpenAIProvider(api_key=api_key, model=model)

        elif provider_type == "lmstudio":
            base_url = config.get("base_url")
            api_key = config.get("api_key", "lm-studio")
            model = config.get("model", "local-model")

            if not base_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="LM Studio base URL not configured",
                )

            return LMStudioProvider(base_url=base_url, api_key=api_key, model=model)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown provider type: {provider_type}",
            )