import { Injectable } from '@nestjs/common';
import { SeedRepository } from '../shared/seed.repository';

@Injectable()
export class CurriculumService {
  constructor(private readonly repository: SeedRepository) {}

  subjects() {
    return this.repository.subjects;
  }

  topics(subjectId: string) {
    return this.repository.topics.filter((topic) => topic.subjectId === subjectId);
  }
}
