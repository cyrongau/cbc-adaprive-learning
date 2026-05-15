import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { StudentProfile, User } from '../shared/domain.types';
import { SeedRepository } from '../shared/seed.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: SeedRepository) {}

  roles() {
    return ['student', 'admin', 'teacher'];
  }

  login(loginDto: LoginDto) {
    const user = this.repository.users.find((candidate) => candidate.email === loginDto.email);
    if (!user || !this.passwordMatches(user.id, loginDto.password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.session(user);
  }

  registerStudent(registerStudentDto: RegisterStudentDto) {
    const existingUser = this.repository.users.find(
      (candidate) => candidate.email.toLowerCase() === registerStudentDto.email.toLowerCase(),
    );
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const user: User = {
      id: `student-${String(this.repository.users.length + 1).padStart(3, '0')}`,
      name: registerStudentDto.name,
      email: registerStudentDto.email.toLowerCase(),
      role: 'student',
      grade: registerStudentDto.grade,
      schoolTerm: registerStudentDto.schoolTerm,
      onboardingStatus: 'not_started',
    };

    this.repository.users.push(user);
    this.repository.credentials.push({
      userId: user.id,
      passwordHash: this.hashPassword(registerStudentDto.password),
    });

    const profile: StudentProfile = {
      studentId: user.id,
      grade: registerStudentDto.grade,
      schoolTerm: registerStudentDto.schoolTerm,
      level: 'emerging',
      coveredTopicIds: [],
      recommendedTopicIds: this.repository.topics.slice(0, 2).map((topic) => topic.id),
      weakTopicIds: [],
      confidence: 0.24,
      updatedAt: new Date().toISOString(),
    };
    this.repository.studentProfiles.push(profile);

    return this.session(user);
  }

  private session(user: User) {
    return {
      accessToken: `phase1-demo-token-${user.id}`,
      refreshToken: `phase1-demo-refresh-${user.id}`,
      user,
    };
  }

  private passwordMatches(userId: string, password: string) {
    const credential = this.repository.credentials.find((candidate) => candidate.userId === userId);
    return credential?.passwordHash === this.hashPassword(password);
  }

  private hashPassword(password: string) {
    return createHash('sha256').update(password).digest('hex');
  }
}
