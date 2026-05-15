import { Injectable, NotFoundException } from '@nestjs/common';
import { OnboardingQuestion, StudentLevel, StudentProfile } from '../shared/domain.types';
import { SeedRepository } from '../shared/seed.repository';
import { CreateOnboardingProfileDto } from './dto/create-onboarding-profile.dto';

@Injectable()
export class OnboardingService {
  constructor(private readonly repository: SeedRepository) {}

  createProfile(createProfileDto: CreateOnboardingProfileDto) {
    const student = this.repository.users.find((candidate) => candidate.id === createProfileDto.studentId);
    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    student.grade = createProfileDto.grade;
    student.schoolTerm = createProfileDto.schoolTerm;
    student.onboardingStatus = 'diagnostic_ready';

    const coveredTopicIds = createProfileDto.chosenTopicIds.filter((topicId) =>
      this.repository.topics.some((topic) => topic.id === topicId),
    );
    const recommendedTopicIds = this.recommendedTopics(createProfileDto.schoolTerm, coveredTopicIds);

    const existingProfile = this.repository.studentProfiles.find(
      (candidate) => candidate.studentId === createProfileDto.studentId,
    );
    const profile: StudentProfile = {
      studentId: createProfileDto.studentId,
      grade: createProfileDto.grade,
      schoolTerm: createProfileDto.schoolTerm,
      level: 'approaching',
      coveredTopicIds,
      recommendedTopicIds,
      weakTopicIds: recommendedTopicIds.slice(0, 2),
      confidence: 0.58,
      updatedAt: new Date().toISOString(),
    };

    if (existingProfile) {
      Object.assign(existingProfile, profile);
      return existingProfile;
    }

    this.repository.studentProfiles.push(profile);
    return profile;
  }

  session(studentId: string) {
    const student = this.repository.users.find((candidate) => candidate.id === studentId);
    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    const profile = this.repository.studentProfiles.find((candidate) => candidate.studentId === studentId);
    const selectedTopicIds = profile?.coveredTopicIds.length
      ? profile.coveredTopicIds
      : this.repository.topics.map((topic) => topic.id);
    const questions = this.repository.onboardingQuestions.filter((question) =>
      selectedTopicIds.includes(question.topicId),
    );

    return {
      studentId,
      grade: student.grade,
      schoolTerm: student.schoolTerm,
      purpose:
        'Establish current coverage, study level, and likely weak areas before adaptive revision begins.',
      questions,
    };
  }

  profile(studentId: string) {
    const profile = this.repository.studentProfiles.find((candidate) => candidate.studentId === studentId);
    if (!profile) {
      throw new NotFoundException('Student profile not found.');
    }

    const topicNames = (topicIds: string[]) =>
      topicIds.map((topicId) => this.repository.topics.find((topic) => topic.id === topicId)?.name ?? topicId);

    return {
      ...profile,
      levelLabel: this.levelLabel(profile.level),
      coveredTopics: topicNames(profile.coveredTopicIds),
      recommendedTopics: topicNames(profile.recommendedTopicIds),
      weakTopics: topicNames(profile.weakTopicIds),
    };
  }

  private recommendedTopics(schoolTerm: string, coveredTopicIds: string[]) {
    const allTopicIds = this.repository.topics.map((topic) => topic.id);
    const uncoveredTopicIds = allTopicIds.filter((topicId) => !coveredTopicIds.includes(topicId));
    if (schoolTerm === 'term-one') {
      return uncoveredTopicIds.slice(0, 2);
    }

    if (schoolTerm === 'term-two') {
      return uncoveredTopicIds.slice(0, 3);
    }

    return uncoveredTopicIds.length ? uncoveredTopicIds : allTopicIds.slice(-2);
  }

  private levelLabel(level: StudentLevel) {
    const labels: Record<StudentLevel, string> = {
      emerging: 'Needs guided foundations',
      approaching: 'Building topic fluency',
      meeting: 'On track for current grade',
      exceeding: 'Ready for stretch practice',
    };

    return labels[level];
  }
}
