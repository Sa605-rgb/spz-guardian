from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings. Copy .env.example to .env to override."""

    app_env: str = "dev"
    api_prefix: str = "/v1"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    demo_email: str = "admin@lhs.local"
    demo_password: str = "demo1234"
    ingest_api_key: str = "dev-ingest-key"
    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
