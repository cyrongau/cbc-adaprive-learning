import { Injectable, NotFoundException } from '@nestjs/common';
import { OcrResult, PaperUpload } from '../shared/domain.types';
import { SeedRepository } from '../shared/seed.repository';
import { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly repository: SeedRepository) {}

  list() {
    return this.repository.uploads;
  }

  ocrResult(uploadId: string): OcrResult {
    const result = this.repository.ocrResults.find((candidate) => candidate.uploadId === uploadId);
    if (!result) {
      throw new NotFoundException('OCR result not found.');
    }

    return result;
  }

  create(createUploadDto: CreateUploadDto): PaperUpload {
    const upload: PaperUpload = {
      id: `upload-${String(this.repository.uploads.length + 1).padStart(3, '0')}`,
      title: createUploadDto.title,
      subjectId: createUploadDto.subjectId,
      uploadedBy: createUploadDto.uploadedBy,
      fileName: createUploadDto.fileName,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
    };
    this.repository.uploads.push(upload);
    return upload;
  }

  approve(uploadId: string): PaperUpload {
    const upload = this.repository.uploads.find((candidate) => candidate.id === uploadId);
    if (!upload) {
      throw new NotFoundException('Upload not found.');
    }

    upload.status = 'approved';
    return upload;
  }
}
