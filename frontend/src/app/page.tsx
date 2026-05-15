'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3101/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'teacher';
  grade?: number;
  schoolTerm?: string;
  onboardingStatus?: string;
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

interface OcrResult {
  extractedText: string;
  structuredQuestionCount: number;
  confidence: number;
  reviewNotes: string[];
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

type View = 'onboarding' | 'practice' | 'ocr' | 'analytics';
type AuthMode = 'login' | 'register';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const emptyPerformance: Performance = {
  totalAttempts: 0,
  correctAttempts: 0,
  accuracy: 0,
  weakTopics: [],
};

const emptyProfile: StudentProfile = {
  levelLabel: 'Awaiting onboarding',
  schoolTerm: 'term-one',
  coveredTopics: [],
  recommendedTopics: [],
  weakTopics: [],
  confidence: 0,
};

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiUrl}${path}`, { cache: 'no-store' });
    return response.ok ? ((await response.json()) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('onboarding');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [session, setSession] = useState<OnboardingSession>({ purpose: '', questions: [] });
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [performance, setPerformance] = useState<Performance>(emptyPerformance);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['algebra-linear-equations']);
  const [term, setTerm] = useState('term-two');
  const [grade, setGrade] = useState(9);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('Sign in or register to start a Phase 1 learner session.');
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({
    name: 'Amani Otieno',
    email: 'amani@example.com',
    password: 'password123',
    grade: 9,
    schoolTerm: 'term-two',
  });

  async function loadData(currentStudentId: string) {
    const [topicData, questionData, uploadData, sessionData, profileData, performanceData] = await Promise.all([
      getJson<Topic[]>('/curriculum/subjects/math/topics', []),
      getJson<Question[]>('/questions?subjectId=math', []),
      getJson<Upload[]>('/uploads', []),
      getJson<OnboardingSession>(`/onboarding/students/${currentStudentId}/session`, { purpose: '', questions: [] }),
      getJson<StudentProfile>(`/onboarding/students/${currentStudentId}/profile`, emptyProfile),
      getJson<Performance>(`/analytics/students/${currentStudentId}/performance`, emptyPerformance),
    ]);

    setTopics(topicData);
    setQuestions(questionData);
    setUploads(uploadData);
    setSession(sessionData);
    setProfile(profileData);
    setPerformance(performanceData);

    if (uploadData[0]) {
      setOcrResult(await getJson<OcrResult | null>(`/uploads/${uploadData[0].id}/ocr-result`, null));
    }
  }

  useEffect(() => {
    if (activeUser) {
      void loadData(activeUser.id);
    }
  }, [activeUser]);

  const activeQuestion = questions[0];
  const weakTopics = profile.weakTopics.length ? profile.weakTopics : performance.weakTopics;
  const accuracy = Math.round(performance.accuracy * 100);

  const navItems = useMemo(
    () => [
      ['onboarding', 'Onboarding'],
      ['practice', 'Practice'],
      ['ocr', 'OCR Review'],
      ['analytics', 'Analytics'],
    ] as const,
    [],
  );

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');

    const path = authMode === 'login' ? '/auth/login' : '/auth/register/student';
    const payload =
      authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : {
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
            grade: authForm.grade,
            schoolTerm: authForm.schoolTerm,
          };

    const response = await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Authentication failed.' }));
      setAuthError(Array.isArray(error.message) ? error.message.join(' ') : error.message);
      return;
    }

    const sessionResponse = (await response.json()) as AuthResponse;
    setActiveUser(sessionResponse.user);
    setGrade(sessionResponse.user.grade ?? authForm.grade);
    setTerm(sessionResponse.user.schoolTerm ?? authForm.schoolTerm);
    setNotice(
      authMode === 'login'
        ? `Welcome back, ${sessionResponse.user.name}.`
        : `Profile created for ${sessionResponse.user.name}. Complete onboarding to sharpen recommendations.`,
    );
  }

  async function submitOnboarding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeUser) {
      return;
    }
    await fetch(`${apiUrl}/onboarding/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: activeUser.id,
        grade,
        schoolTerm: term,
        chosenTopicIds: selectedTopics,
      }),
    });
    setNotice('Profile updated. Diagnostic questions refreshed from mocked onboarding data.');
    await loadData(activeUser.id);
  }

  async function submitAttempt(question: Question, answer: string) {
    if (!activeUser) {
      return;
    }
    if (!answer.trim()) {
      setFeedback((current) => ({ ...current, [question.id]: 'Enter an answer first.' }));
      return;
    }

    const result = await fetch(`${apiUrl}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: activeUser.id, questionId: question.id, submittedAnswer: answer }),
    });
    const attempt = result.ok ? await result.json() : null;
    setFeedback((current) => ({
      ...current,
      [question.id]: attempt?.isCorrect ? 'Correct. This attempt improved the profile signal.' : 'Not quite. Review the explanation and try another item.',
    }));
    await loadData(activeUser.id);
  }

  async function approveUpload(uploadId: string) {
    await fetch(`${apiUrl}/uploads/${uploadId}/approve`, { method: 'PATCH' });
    setNotice('OCR item approved in the mocked review queue.');
    if (activeUser) {
      await loadData(activeUser.id);
    }
  }

  if (!activeUser) {
    return (
      <main className="authShell">
        <section className="authHero">
          <p className="heroPill">Adaptive CBC Learning</p>
          <h1>Start with a learner profile, not a blank dashboard.</h1>
          <p>
            Students register with grade and term details, then move into topic coverage checks and diagnostic
            questions before adaptive practice begins.
          </p>
        </section>

        <form className="authCard" onSubmit={submitAuth}>
          <div className="panelHeader">
            <p className="eyebrow">Student access</p>
            <h2>{authMode === 'login' ? 'Sign in to the mock account' : 'Create a student profile'}</h2>
          </div>
          <div className="authSwitch" role="tablist" aria-label="Authentication mode">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')} type="button">
              Sign in
            </button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')} type="button">
              Register
            </button>
          </div>
          {authMode === 'register' ? (
            <label>
              Student name
              <input
                onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                value={authForm.name}
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              value={authForm.email}
            />
          </label>
          <label>
            Password
            <input
              onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              value={authForm.password}
            />
          </label>
          {authMode === 'register' ? (
            <>
              <label>
                Class grade
                <input
                  max={12}
                  min={1}
                  onChange={(event) => setAuthForm((current) => ({ ...current, grade: Number(event.target.value) }))}
                  type="number"
                  value={authForm.grade}
                />
              </label>
              <label>
                School session
                <select
                  onChange={(event) => setAuthForm((current) => ({ ...current, schoolTerm: event.target.value }))}
                  value={authForm.schoolTerm}
                >
                  <option value="term-one">Term One</option>
                  <option value="term-two">Term Two</option>
                  <option value="term-three">Term Three</option>
                </select>
              </label>
            </>
          ) : null}
          {authError ? <p className="authError">{authError}</p> : null}
          <button className="primaryButton" type="submit">
            {authMode === 'login' ? 'Sign in' : 'Create profile'}
          </button>
          <p className="authHint">Demo account: amani@example.com / password123</p>
        </form>
      </main>
    );
  }

  return (
    <main className="appShell">
      <header className="topAppBar">
        <div className="topBrand">
          <span className="material-symbols-outlined" aria-hidden="true">
            auto_awesome
          </span>
          <strong>Adaptive CBC Learning</strong>
        </div>
        <label className="globalSearch">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input placeholder="Search lessons, topics, papers..." />
        </label>
        <div className="topActions">
          <button aria-label="Notifications" type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              notifications
            </span>
          </button>
          <button aria-label="Achievements" type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              emoji_events
            </span>
          </button>
          <div className="avatar" aria-label={activeUser.name}>
            {activeUser.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <div className="brandBlock">
          <span className="brandMark">
            <span className="material-symbols-outlined" aria-hidden="true">
              auto_awesome
            </span>
          </span>
          <div>
            <strong>Adaptive CBC Learning</strong>
            <p>Grade {activeUser.grade ?? grade} Student</p>
          </div>
        </div>
        <nav className="sideNav" aria-label="App sections">
          {navItems.map(([id, label]) => (
            <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)} type="button">
              <span className="material-symbols-outlined" aria-hidden="true">
                {id === 'onboarding' ? 'dashboard' : id === 'practice' ? 'psychology' : id === 'ocr' ? 'document_scanner' : 'leaderboard'}
              </span>
              {label}
            </button>
          ))}
        </nav>
        <button className="upgradeCard" type="button">
          <span className="material-symbols-outlined" aria-hidden="true">
            bolt
          </span>
          Ask Adaptive CBC
        </button>
        <div className="profileCard">
          <span>Current profile</span>
          <strong>{profile.levelLabel}</strong>
          <p>{Math.round(profile.confidence * 100)}% confidence</p>
        </div>
      </aside>

      <section className="content">
        <header className="appHero">
          <div>
            <p className="heroPill">Mocked Phase 1 App</p>
            <h1>Habari, {activeUser.name.split(' ')[0]}. Ready for today&apos;s learning path?</h1>
            <p>
              Start with onboarding diagnostics, continue adaptive Mathematics practice, and review AI-extracted
              papers with a human check before publishing.
            </p>
            <div className="heroActions">
              <button className="primaryButton" onClick={() => setView('practice')} type="button">
                Start practice
              </button>
              <button className="heroSecondary" onClick={() => setView('analytics')} type="button">
                View analytics
              </button>
            </div>
          </div>
          <figure className="heroVisual">
            <img
              alt="Student using a tablet for CBC learning"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe9Gigkmm3w1tt0JOqBkFXRI7Bmxhy_E1MHEeqNGoQnTc9lBGK71jSKaS8_rOVefFKo2Mb5S9E5aSfEnAAfwhvmeK1RbB0Pi5FqLrsNqhXqwkVqDV8CGHamrLslCiYZZmoxwJfJMgKyPPs_-9sbSdMiAACeVisq9nf4dgzc8MZ-uWxVhTDRjjegTOiz8IS7wxJPMZlwJqLqDFWcgBqpqz3C6XG29aG_FkAbUDafPLfxj6_ok_HCJKEcLe9SHBVLo7LYplo24dq9g"
            />
            <figcaption>{notice}</figcaption>
          </figure>
        </header>

        <section className="summaryGrid" aria-label="App summary">
          <article>
            <span>{topics.length}</span>
            <p>Math topics</p>
          </article>
          <article>
            <span>{questions.length}</span>
            <p>Practice items</p>
          </article>
          <article>
            <span>{accuracy}%</span>
            <p>Accuracy</p>
          </article>
          <article>
            <span>{weakTopics.length}</span>
            <p>Weak topics</p>
          </article>
        </section>

        {view === 'onboarding' ? (
          <section className="workGrid">
            <form className="panel formPanel" onSubmit={submitOnboarding}>
              <div className="panelHeader">
                <p className="eyebrow">Student onboarding</p>
                <h2>Tell the platform where the learner is now</h2>
              </div>
              <label>
                Class grade
                <input max={12} min={1} onChange={(event) => setGrade(Number(event.target.value))} type="number" value={grade} />
              </label>
              <label>
                School session
                <select onChange={(event) => setTerm(event.target.value)} value={term}>
                  <option value="term-one">Term One</option>
                  <option value="term-two">Term Two</option>
                  <option value="term-three">Term Three</option>
                </select>
              </label>
              <fieldset>
                <legend>Topics already covered</legend>
                {topics.map((topic) => (
                  <label className="checkRow" key={topic.id}>
                    <input
                      checked={selectedTopics.includes(topic.id)}
                      onChange={(event) => {
                        setSelectedTopics((current) =>
                          event.target.checked ? [...current, topic.id] : current.filter((id) => id !== topic.id),
                        );
                      }}
                      type="checkbox"
                    />
                    <span>{topic.name}</span>
                  </label>
                ))}
              </fieldset>
              <button className="primaryButton" type="submit">
                Generate learner profile
              </button>
            </form>

            <section className="panel">
              <div className="panelHeader">
                <p className="eyebrow">Diagnostic session</p>
                <h2>Coverage checks and skill questions</h2>
              </div>
              <p className="lede">{session.purpose}</p>
              <div className="diagnosticList spacious">
                {session.questions.map((question) => (
                  <article key={question.id}>
                    <span>{question.intent.replace('_', ' ')}</span>
                    <strong>{question.prompt}</strong>
                    <p>{question.expectedSignal}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : null}

        {view === 'practice' ? (
          <section className="workGrid">
            <section className="panel">
              <div className="panelHeader">
                <p className="eyebrow">Adaptive practice</p>
                <h2>Answer mocked questions</h2>
              </div>
              <div className="questionList">
                {questions.map((question) => (
                  <article className="question" key={question.id}>
                    <div className="questionImage" aria-hidden="true">
                      <img
                        alt=""
                        src={
                          question.id === 'q-001'
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMPC5-3oTyFs4ausJBPXwSyuOjzs4DhmiuN4CVPM4qaOmfGdZLIlV5WLoVG-CNBw0vWTbklWbshtG5S7UeWGk3Xw29igVlz7RrqmYlz1Llx8bXqkMcRjoYn714-d3Uv01R2VvMXomBX9OJc9OCZjS1iW3wuIBAQ9lq8crjMck1l7cPh8-YuBZ6FaRFmmLqyjKlOkvakXapXnn7vbr6CBxpfkHXwzr9wyxA3uRosDzZ9N1CpkeHwedvCOfMnh34lqaJmnrBKKuFmA'
                            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmrp1ggqsp4CZ6N8OpZoWHJAxL9SfcrjOHV1wfcf1hZ1zfMMo4xtJqzBXT5YC6N4yid1U8GSHBUXIWgpFfPVyP2KNvXX07Ov-so7dbNGtpGsb2FqHbrw8VEtNRXRtFv8cRi7zdQyDPBKcgBI1j7XhPnDh62Iog0cER5k5V7JZT-L5r0S75eHnJyAYZk4Ojk-hIf3rneVbEUH0O1CRPm4yJS8TbCuKVy1liH1Wtcd5KuZPK8SwvnXerAizsCqcXkw7Oq8L58gypw'
                        }
                      />
                    </div>
                    <div className="questionMeta">
                      <span>{question.difficulty}</span>
                      <span>{question.competencyTags.join(', ')}</span>
                    </div>
                    <h3>{question.prompt}</h3>
                    <div className="answerRow">
                      <input
                        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                        placeholder={question.options ? 'Type or click an option' : 'Type your answer'}
                        value={answers[question.id] ?? ''}
                      />
                      <button onClick={() => submitAttempt(question, answers[question.id] ?? '')} type="button">
                        Submit
                      </button>
                    </div>
                    {question.options ? (
                      <div className="options">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                            type="button"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {feedback[question.id] ? <p className="feedback">{feedback[question.id]}</p> : null}
                    <details>
                      <summary>Show explanation</summary>
                      <p>{question.explanation}</p>
                    </details>
                  </article>
                ))}
              </div>
            </section>

            <aside className="panel compact">
              <div className="panelHeader">
                <p className="eyebrow">Recommended next</p>
                <h2>{profile.recommendedTopics[0] ?? activeQuestion?.competencyTags[0] ?? 'Practice'}</h2>
              </div>
              <p className="metric">
                {performance.correctAttempts}/{performance.totalAttempts} correct attempts
              </p>
              <div className="tags">
                {(weakTopics.length ? weakTopics : ['No weak topics yet']).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        {view === 'ocr' ? (
          <section className="workGrid">
            <section className="panel">
              <div className="panelHeader">
                <p className="eyebrow">Human-in-the-loop OCR</p>
                <h2>Review extracted paper content</h2>
              </div>
              <div className="uploadList">
                {uploads.map((upload) => (
                  <article key={upload.id}>
                    <strong>{upload.title}</strong>
                    <span>{upload.status.replace('_', ' ')}</span>
                    <p>{upload.fileName}</p>
                    <button className="secondaryButton" onClick={() => approveUpload(upload.id)} type="button">
                      Mark as correct
                    </button>
                  </article>
                ))}
              </div>
            </section>
            <aside className="panel compact warningPanel">
              <div className="panelHeader">
                <p className="eyebrow">AI extraction</p>
                <h2>Needs review</h2>
              </div>
              <p>{ocrResult?.extractedText ?? 'No OCR result loaded.'}</p>
              <p className="metric">{Math.round((ocrResult?.confidence ?? 0) * 100)}% confidence</p>
              <div className="tags">
                {(ocrResult?.reviewNotes ?? ['Review extracted formulas before publishing']).map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        {view === 'analytics' ? (
          <section className="workGrid">
            <section className="panel">
              <div className="panelHeader">
                <p className="eyebrow">Learner profile</p>
                <h2>Weakness detection summary</h2>
              </div>
              <div className="analyticsGrid">
                <article>
                  <span>Level</span>
                  <strong>{profile.levelLabel}</strong>
                </article>
                <article>
                  <span>School term</span>
                  <strong>{profile.schoolTerm.replace('-', ' ')}</strong>
                </article>
                <article>
                  <span>Accuracy</span>
                  <strong>{accuracy}%</strong>
                </article>
              </div>
              <div className="topicColumns">
                <div>
                  <h3>Covered topics</h3>
                  {(profile.coveredTopics.length ? profile.coveredTopics : ['Complete onboarding']).map((topic) => (
                    <p key={topic}>{topic}</p>
                  ))}
                </div>
                <div>
                  <h3>Weak topics</h3>
                  {(weakTopics.length ? weakTopics : ['No weak topics yet']).map((topic) => (
                    <p key={topic}>{topic}</p>
                  ))}
                </div>
                <div>
                  <h3>Recommended topics</h3>
                  {(profile.recommendedTopics.length ? profile.recommendedTopics : ['Continue practice']).map((topic) => (
                    <p key={topic}>{topic}</p>
                  ))}
                </div>
              </div>
            </section>
          </section>
        ) : null}
      </section>
    </main>
  );
}
