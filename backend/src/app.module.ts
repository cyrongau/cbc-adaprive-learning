import { Module } from '@nestjs/common';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { AttemptsController } from './modules/attempts/attempts.controller';
import { AttemptsService } from './modules/attempts/attempts.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { CurriculumController } from './modules/curriculum/curriculum.controller';
import { CurriculumService } from './modules/curriculum/curriculum.service';
import { OnboardingController } from './modules/onboarding/onboarding.controller';
import { OnboardingService } from './modules/onboarding/onboarding.service';
import { QuestionsController } from './modules/questions/questions.controller';
import { QuestionsService } from './modules/questions/questions.service';
import { SeedRepository } from './modules/shared/seed.repository';
import { UploadsController } from './modules/uploads/uploads.controller';
import { UploadsService } from './modules/uploads/uploads.service';

@Module({
  controllers: [
    AnalyticsController,
    AttemptsController,
    AuthController,
    CurriculumController,
    OnboardingController,
    QuestionsController,
    UploadsController,
  ],
  providers: [
    AnalyticsService,
    AttemptsService,
    AuthService,
    CurriculumService,
    OnboardingService,
    QuestionsService,
    SeedRepository,
    UploadsService,
  ],
})
export class AppModule {}
