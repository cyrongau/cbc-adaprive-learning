import { Injectable } from '@nestjs/common';
import { Question } from '../shared/domain.types';
import { SeedRepository } from '../shared/seed.repository';
import { CreateQuestionDto } from './dto/create-question.dto';

interface QuestionFilters {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  search?: string;
}

@Injectable()
export class QuestionsService {
  constructor(private readonly repository: SeedRepository) {}

  list(filters: QuestionFilters) {
    return this.repository.questions.filter((question) => {
      const matchesSubject = !filters.subjectId || question.subjectId === filters.subjectId;
      const matchesTopic = !filters.topicId || question.topicId === filters.topicId;
      const matchesDifficulty = !filters.difficulty || question.difficulty === filters.difficulty;
      const matchesSearch =
        !filters.search ||
        [question.prompt, question.explanation, ...question.competencyTags]
          .join(' ')
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesSubject && matchesTopic && matchesDifficulty && matchesSearch;
    });
  }

  create(createQuestionDto: CreateQuestionDto): Question {
    const question: Question = {
      id: `q-${String(this.repository.questions.length + 1).padStart(3, '0')}`,
      ...createQuestionDto,
      source: 'admin',
    };
    this.repository.questions.push(question);
    return question;
  }
}
