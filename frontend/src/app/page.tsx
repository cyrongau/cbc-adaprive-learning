const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3101/api';

interface Subject {
  id: string;
  name: string;
  gradeRange: string;
}

interface Topic {
  id: string;
  name: string;
  strand: string;
  competency: string;
}

interface Question {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
  difficulty: string;
  competencyTags: string[];
  options?: string[];
}

interface Upload {
  id: string;
  title: string;
  status: string;
  fileName: string;
}

interface Performance {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  weakTopics: string[];
}

interface OnboardingQuestion {
  id: string;
  prompt: string;
  intent: 'coverage_check' | 'diagnostic';
  expectedSignal: string;
  difficulty: string;
}

interface OnboardingSession {
  purpose: string;
  grade?: number;
  schoolTerm?: string;
  questions: OnboardingQuestion[];
}

interface StudentProfile {
  levelLabel: string;
  schoolTerm: string;
  coveredTopics: string[];
  recommendedTopics: string[];
  weakTopics: string[];
  confidence: number;
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      return fallback;
    }

    return response.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const subjects = await getJson<Subject[]>('/curriculum/subjects', []);
  const topics = await getJson<Topic[]>('/curriculum/subjects/math/topics', []);
  const questions = await getJson<Question[]>('/questions?subjectId=math', []);
  const uploads = await getJson<Upload[]>('/uploads', []);
  const onboardingSession = await getJson<OnboardingSession>('/onboarding/students/student-001/session', {
    purpose: 'Create a student profile before adaptive revision begins.',
    questions: [],
  });
  const studentProfile = await getJson<StudentProfile>('/onboarding/students/student-001/profile', {
    levelLabel: 'Awaiting onboarding',
    schoolTerm: 'term-one',
    coveredTopics: [],
    recommendedTopics: [],
    weakTopics: [],
    confidence: 0,
  });
  const performance = await getJson<Performance>('/analytics/students/student-001/performance', {
    totalAttempts: 0,
    correctAttempts: 0,
    accuracy: 0,
    weakTopics: [],
  });

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Phase 1 MVP</p>
          <h1>CBC Adapt</h1>
        </div>
        <div className="status">Core workflow online</div>
      </header>

      <section className="summaryGrid" aria-label="Phase 1 summary">
        <article>
          <span>{subjects.length}</span>
          <p>Subjects seeded</p>
        </article>
        <article>
          <span>{topics.length}</span>
          <p>Curriculum topics</p>
        </article>
        <article>
          <span>{questions.length}</span>
          <p>Practice questions</p>
        </article>
        <article>
          <span>{Math.round(performance.accuracy * 100)}%</span>
          <p>Student accuracy</p>
        </article>
      </section>

      <section className="panel onboardingPanel">
        <div className="panelHeader">
          <p className="eyebrow">Student onboarding</p>
          <h2>Registration now creates an adaptive learning profile</h2>
        </div>
        <div className="onboardingGrid">
          <div>
            <p className="lede">
              After a student enters their class grade, level, and current school term, the platform starts a
              topic-coverage check followed by diagnostic questions. Those answers establish study level, weak
              topics, and the first recommended practice path.
            </p>
            <div className="profileChips">
              <span>Grade {onboardingSession.grade ?? 9}</span>
              <span>{studentProfile.schoolTerm.replace('-', ' ')}</span>
              <span>{studentProfile.levelLabel}</span>
              <span>{Math.round(studentProfile.confidence * 100)}% profile confidence</span>
            </div>
          </div>
          <div className="diagnosticList">
            {onboardingSession.questions.slice(0, 3).map((question) => (
              <article key={question.id}>
                <span>{question.intent.replace('_', ' ')}</span>
                <strong>{question.prompt}</strong>
                <p>{question.expectedSignal}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Student revision</p>
            <h2>Mathematics practice</h2>
          </div>
          <div className="questionList">
            {questions.map((question) => (
              <article className="question" key={question.id}>
                <div className="questionMeta">
                  <span>{question.difficulty}</span>
                  <span>{question.competencyTags.join(', ')}</span>
                </div>
                <h3>{question.prompt}</h3>
                {question.options ? (
                  <div className="options">
                    {question.options.map((option) => (
                      <button key={option} type="button">
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
                <details>
                  <summary>Show AI-style explanation</summary>
                  <p>{question.explanation}</p>
                </details>
              </article>
            ))}
          </div>
        </div>

        <aside className="sideStack">
          <section className="panel compact">
            <div className="panelHeader">
              <p className="eyebrow">Curriculum map</p>
              <h2>Topics</h2>
            </div>
            <div className="topicList">
              {topics.map((topic) => (
                <article key={topic.id}>
                  <strong>{topic.name}</strong>
                  <span>{topic.strand}</span>
                  <p>{topic.competency}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel compact">
            <div className="panelHeader">
              <p className="eyebrow">Admin workflow</p>
              <h2>OCR review queue</h2>
            </div>
            <div className="uploadList">
              {uploads.map((upload) => (
                <article key={upload.id}>
                  <strong>{upload.title}</strong>
                  <span>{upload.status.replace('_', ' ')}</span>
                  <p>{upload.fileName}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel compact">
            <div className="panelHeader">
              <p className="eyebrow">Learner profile</p>
              <h2>Weakness detection</h2>
            </div>
            <p className="metric">
              {performance.correctAttempts}/{performance.totalAttempts} correct attempts
            </p>
            <div className="tags">
              {(studentProfile.weakTopics.length
                ? studentProfile.weakTopics
                : performance.weakTopics.length
                  ? performance.weakTopics
                  : ['No weak topics yet']
              ).map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
            <div className="nextTopics">
              <strong>Next recommended topics</strong>
              {(studentProfile.recommendedTopics.length
                ? studentProfile.recommendedTopics
                : ['Complete onboarding diagnostics']).map((topic) => (
                <p key={topic}>{topic}</p>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
