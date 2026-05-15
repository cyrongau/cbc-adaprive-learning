import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOnboardingProfileDto } from './dto/create-onboarding-profile.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('profiles')
  createProfile(@Body() createProfileDto: CreateOnboardingProfileDto) {
    return this.onboardingService.createProfile(createProfileDto);
  }

  @Get('students/:studentId/session')
  session(@Param('studentId') studentId: string) {
    return this.onboardingService.session(studentId);
  }

  @Get('students/:studentId/profile')
  profile(@Param('studentId') studentId: string) {
    return this.onboardingService.profile(studentId);
  }
}
