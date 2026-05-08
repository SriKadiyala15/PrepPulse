import os
from dotenv import load_dotenv

# =========================
# LOAD ENV FIRST (CRITICAL)
# =========================
load_dotenv()



from typing import Any, Dict, List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Quiz
from scraper import fetch_and_clean_article, fetch_article_title, ScrapeError
from llm_quiz_generator import (
    generate_quiz
)

# =========================
# DB INIT
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# FASTAPI APP
# =========================
app = FastAPI(title="AI Wiki Quiz Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST SCHEMAS
# =========================
class GenerateQuizRequest(BaseModel):
    url: str


class ValidateUrlRequest(BaseModel):
    url: str


# =========================
# DEBUG / HEALTH
# =========================
# =========================
# URL VALIDATION
# =========================
@app.post("/validate_url")
def validate_url_endpoint(
    payload: ValidateUrlRequest, db: Session = Depends(get_db)
):
    try:
        title = fetch_article_title(payload.url)
    except ScrapeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    existing = db.query(Quiz).filter(Quiz.url == payload.url).first()

    return {
        "valid": True,
        "title": title,
        "url": payload.url,
        "exists": bool(existing),
        "existing_id": existing.id if existing else None,
    }


# =========================
# GENERATE QUIZ
# =========================
@app.post("/generate_quiz")
def generate_quiz_endpoint(
    payload: GenerateQuizRequest, db: Session = Depends(get_db)
):
    # Cache check
    existing = db.query(Quiz).filter(Quiz.url == payload.url).first()
    if existing:
        return {
            "id": existing.id,
            "url": existing.url,
            **existing.quiz_json,
        }

    try:
        title, text, raw_html = fetch_and_clean_article(payload.url)
    except ScrapeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    try:
        quiz = generate_quiz(title, text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"LLM error: {exc}")

    quiz_record = Quiz(
        url=payload.url,
        title=quiz.title,
        summary=quiz.summary,
        quiz_json=quiz.model_dump(),
        raw_html=raw_html,
    )

    db.add(quiz_record)
    db.commit()
    db.refresh(quiz_record)

    return {
        "id": quiz_record.id,
        "url": quiz_record.url,
        **quiz_record.quiz_json,
    }


# =========================
# HISTORY
# =========================
@app.get("/history")
def history(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).order_by(Quiz.id.asc()).all()
    return [
        {
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "date_generated": q.date_generated,
        }
        for q in quizzes
    ]


# =========================
# FETCH SINGLE QUIZ
# =========================
@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz.quiz_json
