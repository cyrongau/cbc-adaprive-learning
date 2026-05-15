import { Controller, Get, Param } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('subjects')
  subjects() {
    return this.curriculumService.subjects();
  }

  @Get('subjects/:subjectId/topics')
  topics(@Param('subjectId') subjectId: string) {
    return this.curriculumService.topics(subjectId);
  }
}
