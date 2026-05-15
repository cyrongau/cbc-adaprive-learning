import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { Difficulty, QuestionType } from '../../shared/domain.types';

export class CreateQuestionDto {
  @IsString()
  subjectId!: string;

  @IsString()
  topicId!: string;

  @IsIn(['mcq', 'structured', 'mathematical'])
  type!: QuestionType;

  @IsString()
  prompt!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsString()
  answer!: string;

  @IsString()
  explanation!: string;

  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: Difficulty;

  @IsArray()
  @IsString({ each: true })
  competencyTags!: string[];

  @IsOptional()
  @IsString()
  latex?: string;
}
