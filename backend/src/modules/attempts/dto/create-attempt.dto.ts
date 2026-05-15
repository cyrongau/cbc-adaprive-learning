import { IsString } from 'class-validator';

export class CreateAttemptDto {
  @IsString()
  studentId!: string;

  @IsString()
  questionId!: string;

  @IsString()
  submittedAnswer!: string;
}
