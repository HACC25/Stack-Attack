from sqlalchemy import Column, DateTime, Text, func
from src.utils.postgres.connection_handler import Base
from sqlalchemy.dialects.postgresql import UUID


class Documents(Base):
    __tablename__ = "documents"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )
    title = Column(Text, nullable=True)
    unit = Column(Text, nullable=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
    target_audience = Column(Text, nullable=True)
    file_name = Column(Text, unique=True, nullable=False, index=True)

    def __repr__(self):
        return f"<Documents(id={self.id}, file_name='{self.file_name}', title='{self.title}', unit='{self.unit}')>"
