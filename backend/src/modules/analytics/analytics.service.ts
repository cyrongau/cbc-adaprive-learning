import { Injectable } from '@nestjs/common';
import { SeedRepository } from '../shared/seed.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly repository: SeedRepository) {}

  performance(studentId: string) {
    const attempts = this.repository.attempts.filter((attempt) => attempt.studentId === studentId);
    const attemptsByTopic = attempts.reduce<Record<string, { total: number; correct: number }>>((summary, attempt) => {
      const question = this.repository.questions.find((candidate) => candidate.id === attempt.questionId);
      if (!question) {
        return summary;
      }

      const topic = this.repository.topics.find((candidate) => candidate.id === question.topicId);
      const topicName = topic?.name ?? 'Unknown topic';
      summary[topicName] ??= { total: 0, correct: 0 };
      summary[topicName].total += 1;
      summary[topicName].correct += attempt.isCorrect ? 1 : 0;
      return summary;
    }, {});

    const weakTopics = Object.entries(attemptsByTopic)
      .filter(([, value]) => value.correct / value.total < 0.7)
      .map(([topic]) => topic);

    return {
      studentId,
      totalAttempts: attempts.length,
      correctAttempts: attempts.filter((attempt) => attempt.isCorrect).length,
      accuracy: attempts.length ? attempts.filter((attempt) => attempt.isCorrect).length / attempts.length : 0,
      weakTopics,
      attemptsByTopic,
    };
  }
}
