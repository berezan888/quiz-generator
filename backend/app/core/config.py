from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Quiz Generator API"
    app_env: str = "development"

    database_url: str
    openai_api_key: str = "lm-studio"
    openai_api_key2: str = ""
    openai_model: str = "llama-3.3-70b-versatile"
    openai_base_url: str = "http://host.docker.internal:1234/v1"

    jwt_secret_key: str = "supersecret"
    jwt_algorithm: str = "HS256"
    allow_mock_auth: bool = False
    mock_user_id: str = "11111111-1111-1111-1111-111111111111"

    cors_origins: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value):
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


def get_settings() -> Settings:
    return Settings()


settings = Settings()