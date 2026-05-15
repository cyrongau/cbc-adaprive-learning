from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(
    title="CBC Adapt AI Service",
    description="Phase 1 AI and OCR contracts for educational intelligence workflows.",
    version="0.1.0",
)


class ExplanationRequest(BaseModel):
    question: str
    answer: str
    learner_level: str = Field(default="grade-9")


class ExplanationResponse(BaseModel):
    explanation: str
    hints: list[str]
    confidence: float


class DifficultyRequest(BaseModel):
    question: str
    topic: str


class DifficultyResponse(BaseModel):
    difficulty: Literal["easy", "medium", "hard"]
    reasons: list[str]


class OcrStructureRequest(BaseModel):
    extracted_text: str
    subject: str = "Mathematics"


class StructuredQuestion(BaseModel):
    prompt: str
    answer: str | None = None
    type: Literal["mcq", "structured", "mathematical"]
    confidence: float


class OcrStructureResponse(BaseModel):
    questions: list[StructuredQuestion]
    review_notes: list[str]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}


@app.post("/explanations", response_model=ExplanationResponse)
def explain(request: ExplanationRequest) -> ExplanationResponse:
    return ExplanationResponse(
        explanation=(
            "Work backwards from the required answer and show each operation clearly. "
            f"For this item, the expected answer is {request.answer}."
        ),
        hints=[
            "Identify the operation used in the question.",
            "Apply the inverse operation to isolate the unknown.",
            "Substitute the answer back into the question to verify it.",
        ],
        confidence=0.72,
    )


@app.post("/difficulty", response_model=DifficultyResponse)
def estimate_difficulty(request: DifficultyRequest) -> DifficultyResponse:
    word_count = len(request.question.split())
    has_formula = any(symbol in request.question for symbol in ["=", "/", "^", "x"])
    difficulty: Literal["easy", "medium", "hard"] = "easy"
    if word_count > 30 or has_formula:
        difficulty = "medium"
    if word_count > 55:
        difficulty = "hard"

    return DifficultyResponse(
        difficulty=difficulty,
        reasons=[
            f"Topic: {request.topic}",
            f"Question length: {word_count} words",
            "Formula detected" if has_formula else "No formula detected",
        ],
    )


@app.post("/ocr/structure", response_model=OcrStructureResponse)
def structure_ocr(request: OcrStructureRequest) -> OcrStructureResponse:
    lines = [line.strip() for line in request.extracted_text.splitlines() if line.strip()]
    questions = [
        StructuredQuestion(
            prompt=line,
            answer=None,
            type="mathematical" if any(symbol in line for symbol in ["=", "x", "+", "-"]) else "structured",
            confidence=0.66,
        )
        for line in lines
        if line[0].isdigit() or "?" in line
    ]

    return OcrStructureResponse(
        questions=questions,
        review_notes=[
            "Human review is required before publishing OCR output.",
            "Confirm formulas and diagrams against the source paper.",
        ],
    )
