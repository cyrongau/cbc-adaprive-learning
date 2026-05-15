import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('students/:studentId/performance')
  performance(@Param('studentId') studentId: string) {
    return this.analyticsService.performance(studentId);
  }
}
