import random
import re
from collections import Counter
from typing import List, Optional

from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(min_length=4, max_length=4)
    answer: str
    explanation: str
    difficulty: str
    section: Optional[str] = None


class KeyEntities(BaseModel):
    people: List[str] = Field(default_factory=list)
    organizations: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)


class QuizSchema(BaseModel):
    title: str
    summary: str
    key_entities: Optional[KeyEntities] = Field(default_factory=KeyEntities)
    related_topics: List[str] = Field(default_factory=list)
    questions: List[QuizQuestion] = Field(min_length=5, max_length=10)
    sections: Optional[List[str]] = None


def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()


def extract_keywords(text, limit=20):
    words = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b', text)
    common = Counter(words).most_common(limit)
    return [w[0] for w in common]


def sentence_split(text):
    return re.split(r'(?<=[.!?])\s+', text)


def generate_quiz(article_title: str, article_text: str) -> QuizSchema:
    text = clean_text(article_text[:15000])
    sentences = [s for s in sentence_split(text) if len(s.split()) > 8]

    keywords = extract_keywords(text)
    related_topics = keywords[:5]

    questions = []
    for i, sentence in enumerate(sentences[:10]):
        match = re.search(r'([A-Z][a-zA-Z]{3,})', sentence)
        if not match:
            continue

        answer = match.group(1)
        question_text = sentence.replace(answer, '_____')

        distractors = [k for k in keywords if k != answer]
        random.shuffle(distractors)
        options = distractors[:3] + [answer]
        random.shuffle(options)

        questions.append(QuizQuestion(
            question=f"Fill in the blank: {question_text}",
            options=options,
            answer=answer,
            explanation=f"The correct answer is {answer} based on the article content.",
            difficulty='medium',
            section='General Knowledge'
        ))

        if len(questions) >= 5:
            break

    if len(questions) < 5:
        raise RuntimeError('Not enough content to generate quiz questions.')

    return QuizSchema(
        title=article_title,
        summary='Automatically generated quiz based on the provided article.',
        key_entities=KeyEntities(people=keywords[:3], organizations=keywords[3:6], locations=keywords[6:9]),
        related_topics=related_topics,
        sections=['General Knowledge'],
        questions=questions
    )
