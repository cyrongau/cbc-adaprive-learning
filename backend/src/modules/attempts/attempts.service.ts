import { Injectable, NotFoundException } from '@nestjs/common';
import { Attempt } from '../shared/domain.types';
import { SeedRepository } from '../shared/seed.repository';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(private readonly repository: SeedRepository) {}

  studentAttempts(studentId: string) {
    return this.repository.attempts.filter((attempt) => attempt.studentId === studentId);
  }

  create(createAttemptDto: CreateAttemptDto): Attempt {
    const question = this.repository.questions.find((candidate) => candidate.id === createAttemptDto.questionId);
    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const isCorrect = question.answer.trim().toLowerCase() === createAttemptDto.submittedAnswer.trim().toLowerCase();
    const attempt: Attempt = {
      id: `attempt-${String(this.repository.attempts.length + 1).padStart(3, '0')}`,
      studentId: createAttemptDto.studentId,
      questionId: createAttemptDto.questionId,
      submittedAnswer: createAttemptDto.submittedAnswer,
      isCorrect,
      score: isCorrect ? 1 : 0,
      createdAt: new Date().toISOString(),
    };

    this.repository.attempts.push(attempt);
    return attempt;
  }
}
