# CBC Adapt

Adaptive CBC Learning and Question Intelligence Platform.

Phase 1 proves the core educational intelligence workflow:

1. Students register with grade, level, and current school term.
2. Onboarding diagnostics check covered topics, study level, and early weak areas.
3. Students revise by subject and topic.
4. Questions are stored with answers, explanations, difficulty, and competency tags.
5. Admins ingest uploaded papers through an OCR review pipeline.
6. AI services provide explanations, classification, and structuring contracts.
7. Attempts, onboarding profiles, and performance metrics expose weak topics and revision history.

## Apps

- `backend`: NestJS API gateway and core Phase 1 modules.
- `frontend`: Next.js MVP interface for student and admin workflows.
- `ai-service`: FastAPI service contract for OCR and AI learning features.

## Phase 1 Learning Profile

The onboarding flow creates the first adaptive student profile before normal revision begins. A student provides their grade, current school term, and topics they believe they have covered. The platform then serves a short mix of coverage-check and diagnostic questions. These responses seed:

- current study level,
- covered and recommended topics,
- suspected weak topics,
- confidence score for the learner profile.

## Phase 1 Student Access

The current student auth flow is intentionally lightweight and in-memory. It supports:

- demo login with `amani@example.com` / `password123`,
- student registration with name, email, password, grade, and school term,
- automatic creation of a starter learner profile,
- handoff into onboarding, practice, OCR review, and analytics.

This is suitable for validating the user journey before replacing in-memory data with persistent database-backed accounts and secure token/session handling.

## Local Development

Install Node dependencies from the repository root:

```bash
npm install
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend:

```bash
npm run dev:frontend
```

Run the AI service:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Docker

Copy `.env.example` to `.env` and adjust ports if Docker Desktop already has projects using them.

Defaults:

- Frontend: `http://localhost:3100`
- Backend API: `http://localhost:3101/api`
- AI service: `http://localhost:8101`

Run:

```bash
docker compose up --build
```

Port mappings are controlled by:

- `FRONTEND_PORT`
- `BACKEND_PORT`
- `AI_SERVICE_PORT`
- `FRONTEND_ORIGIN`
- `NEXT_PUBLIC_API_URL`
