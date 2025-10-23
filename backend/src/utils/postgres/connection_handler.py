from typing import Generator
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker
from src.utils.env_helper import get_setting

DB_NAME = get_setting("POSTGRES_NAME")
DB_ENDPOINT = get_setting("POSTGRES_ENDPOINT")
DB_USER = get_setting("POSTGRES_USERNAME")
DB_PASSWORD = get_setting("POSTGRES_PASSWORD")
DB_PORT = get_setting("POSTGRES_PORT")
DB_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_ENDPOINT}:{DB_PORT}/{DB_NAME}"
)


class DB_Manager:
    db_engine: Engine

    def __init__(self):
        self.db_engine = create_engine(url=DB_URL, max_overflow=2, pool_size=5)
        self.session_local = sessionmaker(
            autocommit=False, autoflush=False, bind=self.db_engine
        )

    def get_db(self) -> Generator[Session, None, None]:
        db = self.session_local()
        try:
            yield db
        finally:
            db.close()


db_manager = DB_Manager()
