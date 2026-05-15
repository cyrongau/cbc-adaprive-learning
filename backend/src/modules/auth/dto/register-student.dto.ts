import { IsEmail, IsIn, IsInt, IsString, Max, Min, MinLength } from 'class-validator';
import { SchoolTerm } from '../../shared/domain.types';

export class RegisterStudentDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsInt()
  @Min(1)
  @Max(12)
  grade!: number;

  @IsIn(['term-one', 'term-two', 'term-three'])
  schoolTerm!: SchoolTerm;
}
