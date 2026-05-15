import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Get('students/:studentId')
  studentAttempts(@Param('studentId') studentId: string) {
    return this.attemptsService.studentAttempts(studentId);
  }

  @Post()
  create(@Body() createAttemptDto: CreateAttemptDto) {
    return this.attemptsService.create(createAttemptDto);
  }
}
