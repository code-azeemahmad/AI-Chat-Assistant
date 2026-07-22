from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):  
    '''
    Application configuration loaded from environment variables.
    '''  
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str
    app_version: str
    debug: bool

    # Server
    host: str
    port: int

    # AI Provider
    llm_provider: str

    # Ollama
    ollama_base_url: str
    ollama_model: str

    # Generation
    request_timeout: int
    max_tokens: int
    temperature: float = 0.7


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()