import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SeedRepository } from '../shared/seed.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: SeedRepository) {}

  roles() {
    return ['student', 'admin', 'teacher'];
  }

  login(loginDto: LoginDto) {
    const user = this.repository.users.find((candidate) => candidate.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found in Phase 1 seed accounts.');
    }

    return {
      accessToken: `phase1-demo-token-${user.id}`,
      refreshToken: `phase1-demo-refresh-${user.id}`,
      user,
    };
  }
}
