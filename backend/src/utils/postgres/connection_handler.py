from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.utils.env_helper import get_setting

DB_NAME = get_setting("POSTGRES_NAME")
DB_ENDPOINT = get_setting("POSTGRES_ENDPOINT")
DB_USER = get_setting("POSTGRES_USERNAME")
DB_PASSWORD = get_setting("POSTGRES_PASSWORD")
DB_PORT = get_setting("POSTGRES_PORT")

DB_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_ENDPOINT}:{DB_PORT}/{DB_NAME}"
)
Base = declarative_base()


class AsyncDBManager:
    def __init__(self):
        self.engine = create_async_engine(DB_URL, pool_size=5, max_overflow=2)
        self.session_local = sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
            autocommit=False,
        )

    async def get_db(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.session_local() as session:
            yield session


db_manager = AsyncDBManager()
