from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "insecure-dev-secret-change-me"
    database_url: str = "sqlite:///./contract_reader.db"
    access_token_expire_minutes: int = 60 * 24
    frontend_url: str = "https://signwyz.vercel.app"
    ai_provider: str = "mock"
    anthropic_api_key: str | None = None
    openai_api_key: str | None = None
    gemini_api_key: str | None = None
    google_client_id: str | None = None
    resend_api_key: str | None = None
    email_from: str = "SignWyz <noreply@signwyz.vercel.app>"

    class Config:
        env_file = ".env"


settings = Settings()