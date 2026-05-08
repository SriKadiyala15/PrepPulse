from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(1024), nullable=False, index=True)
    title = Column(String(512), nullable=False)
    summary = Column(Text, nullable=False)
    quiz_json = Column(JSON, nullable=False)
    raw_html = Column(Text, nullable=True)
    date_generated = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
