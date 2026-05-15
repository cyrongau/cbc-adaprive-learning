import { Injectable } from '@nestjs/common';
import {
  Attempt,
  OcrResult,
  OnboardingQuestion,
  PaperUpload,
  Question,
  StudentProfile,
  Subject,
  Topic,
  User,
} from './domain.types';

@Injectable()
export class SeedRepository {
  readonly users: User[] = [
    {
      id: 'student-001',
      name: 'Amani Otieno',
      email: 'amani@example.com',
      role: 'student',
      grade: 9,
      schoolTerm: 'term-two',
      onboardingStatus: 'profiled',
    },
    {
      id: 'admin-001',
      name: 'Content Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  ];

  readonly subjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      gradeRange: 'Grades 7-9',
    },
  ];

  readonly topics: Topic[] = [
    {
      id: 'algebra-linear-equations',
      subjectId: 'math',
      name: 'Linear Equations',
      strand: 'Algebra',
      competency: 'Solve linear equations in one unknown.',
    },
    {
      id: 'geometry-perimeter-area',
      subjectId: 'math',
      name: 'Perimeter and Area',
      strand: 'Geometry',
      competency: 'Calculate perimeter and area of common plane figures.',
    },
    {
      id: 'statistics-data-handling',
      subjectId: 'math',
      name: 'Data Handling',
      strand: 'Statistics',
      competency: 'Interpret and represent data using tables and charts.',
    },
  ];

  readonly questions: Question[] = [
    {
      id: 'q-001',
      subjectId: 'math',
      topicId: 'algebra-linear-equations',
      type: 'mathematical',
      prompt: 'Solve for x: 3x + 5 = 20',
      answer: '5',
      explanation: 'Subtract 5 from both sides to get 3x = 15, then divide both sides by 3. Therefore x = 5.',
      difficulty: 'easy',
      competencyTags: ['algebra', 'linear-equations', 'grade-9'],
      latex: '3x + 5 = 20',
      source: 'seed',
    },
    {
      id: 'q-002',
      subjectId: 'math',
      topicId: 'geometry-perimeter-area',
      type: 'mcq',
      prompt: 'A rectangle has length 12 cm and width 5 cm. What is its perimeter?',
      options: ['17 cm', '34 cm', '60 cm', '120 cm'],
      answer: '34 cm',
      explanation: 'Perimeter of a rectangle is 2(length + width). 2(12 + 5) = 34 cm.',
      difficulty: 'easy',
      competencyTags: ['geometry', 'perimeter', 'grade-7'],
      source: 'seed',
    },
  ];

  readonly onboardingQuestions: OnboardingQuestion[] = [
    {
      id: 'obq-001',
      subjectId: 'math',
      topicId: 'algebra-linear-equations',
      prompt: 'Have you already covered solving one-step and two-step linear equations this term?',
      intent: 'coverage_check',
      expectedSignal: 'Student can identify whether linear equations are familiar or new.',
      difficulty: 'easy',
    },
    {
      id: 'obq-002',
      subjectId: 'math',
      topicId: 'algebra-linear-equations',
      prompt: 'Solve for x: 2x + 7 = 19',
      intent: 'diagnostic',
      expectedSignal: 'Checks inverse operations and algebra fluency.',
      difficulty: 'medium',
    },
    {
      id: 'obq-003',
      subjectId: 'math',
      topicId: 'geometry-perimeter-area',
      prompt: 'Which shapes have you used to calculate perimeter and area in class?',
      intent: 'coverage_check',
      expectedSignal: 'Student reports current geometry coverage.',
      difficulty: 'easy',
    },
    {
      id: 'obq-004',
      subjectId: 'math',
      topicId: 'geometry-perimeter-area',
      prompt: 'A square has a side length of 8 cm. What is its area?',
      intent: 'diagnostic',
      expectedSignal: 'Checks area formula recall and multiplication accuracy.',
      difficulty: 'easy',
    },
    {
      id: 'obq-005',
      subjectId: 'math',
      topicId: 'statistics-data-handling',
      prompt: 'Have you practiced reading bar graphs or frequency tables this term?',
      intent: 'coverage_check',
      expectedSignal: 'Student indicates whether data handling has been introduced.',
      difficulty: 'easy',
    },
  ];

  readonly studentProfiles: StudentProfile[] = [
    {
      studentId: 'student-001',
      grade: 9,
      schoolTerm: 'term-two',
      level: 'approaching',
      coveredTopicIds: ['algebra-linear-equations', 'geometry-perimeter-area'],
      recommendedTopicIds: ['statistics-data-handling'],
      weakTopicIds: ['geometry-perimeter-area'],
      confidence: 0.64,
      updatedAt: new Date().toISOString(),
    },
  ];

  readonly attempts: Attempt[] = [
    {
      id: 'attempt-001',
      studentId: 'student-001',
      questionId: 'q-001',
      submittedAnswer: '5',
      isCorrect: true,
      score: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  readonly uploads: PaperUpload[] = [
    {
      id: 'upload-001',
      title: 'Grade 9 Algebra Revision Paper',
      subjectId: 'math',
      uploadedBy: 'admin-001',
      status: 'needs_review',
      fileName: 'grade-9-algebra.pdf',
      createdAt: new Date().toISOString(),
    },
  ];

  readonly ocrResults: OcrResult[] = [
    {
      id: 'ocr-001',
      uploadId: 'upload-001',
      extractedText: '1. Solve for x: 3x + 5 = 20',
      structuredQuestionCount: 1,
      confidence: 0.91,
      reviewNotes: ['Confirm mathematical notation before approval.'],
    },
  ];
}
