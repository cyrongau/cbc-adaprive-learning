import { IsArray, IsIn, IsInt, IsString, Max, Min } from 'class-validator';
import { SchoolTerm } from '../../shared/domain.types';

export class CreateOnboardingProfileDto {
  @IsString()
  studentId!: string;

  @IsInt()
  @Min(1)
  @Max(12)
  grade!: number;

  @IsIn(['term-one', 'term-two', 'term-three'])
  schoolTerm!: SchoolTerm;

  @IsArray()
  @IsString({ each: true })
  chosenTopicIds!: string[];
}
