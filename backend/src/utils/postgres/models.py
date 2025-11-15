from sqlalchemy import (
    Column,
    DateTime,
    Text,
    ForeignKey,
    func,
    Boolean,
    BIGINT,
    text,
    INT,
)
from src.utils.postgres.connection_handler import Base
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship


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


class Embeddings(Base):
    __tablename__ = "embeddings"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )
    content = Column(Text, nullable=True)
    vector = Column(Vector(dim=1536), nullable=False)
    document_id = Column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    def __repr__(self):
        return f"<Embeddings(id={self.id}, document_id='{self.document_id}')>"


class Users(Base):
    __tablename__ = "users"

    # Google "sub" — globally unique user ID
    sub = Column(Text, primary_key=True, unique=True, index=True)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    picture = Column(Text, nullable=True)

    chats = relationship("Chats", back_populates="user", cascade="all, delete")
    usage = relationship("TokenUsage", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<Users(sub={self.sub}, email='{self.email}')>"


class Chats(Base):
    __tablename__ = "chats"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )
    user_sub = Column(
        Text,
        ForeignKey("users.sub", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    chat_title = Column(
        Text,
        nullable=True,
        index=True,
    )
    target_audience = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("Users", back_populates="chats")
    messages = relationship("Messages", back_populates="chat", cascade="all, delete")

    def __repr__(self):
        return f"<Chats(id={self.id}, created_at='{self.created_at}')>"


class TokenUsage(Base):
    __tablename__ = "token_usage"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )
    user_sub = Column(
        Text,
        ForeignKey("users.sub", ondelete="CASCADE"),
        nullable=False,
        index=True,
        unique=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    message_count = Column(INT, nullable=False, server_default=text("0"))
    prompt_tokens = Column(BIGINT, nullable=False, server_default=text("0"))
    completion_tokens = Column(BIGINT, nullable=False, server_default=text("0"))
    total_tokens = Column(BIGINT, nullable=False, server_default=text("0"))

    user = relationship("Users", back_populates="usage")

    def __repr__(self):
        return f"<TokenUsage(id={self.id}, created_at='{self.created_at}')>"


class Messages(Base):
    __tablename__ = "messages"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )
    chat_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chats.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_by_user = Column(Boolean, nullable=False)
    message_metadata = Column("metadata", JSONB, nullable=True)
    content = Column(Text, nullable=False)

    chat = relationship("Chats", back_populates="messages")

    def __repr__(self):
        return f"<Messages(id={self.id}, content='{self.content}')>"
