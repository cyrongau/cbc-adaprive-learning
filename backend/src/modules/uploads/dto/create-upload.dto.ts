import { IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  title!: string;

  @IsString()
  subjectId!: string;

  @IsString()
  uploadedBy!: string;

  @IsString()
  fileName!: string;
}
