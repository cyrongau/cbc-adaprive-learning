import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  list() {
    return this.uploadsService.list();
  }

  @Get(':uploadId/ocr-result')
  ocrResult(@Param('uploadId') uploadId: string) {
    return this.uploadsService.ocrResult(uploadId);
  }

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadsService.create(createUploadDto);
  }

  @Patch(':uploadId/approve')
  approve(@Param('uploadId') uploadId: string) {
    return this.uploadsService.approve(uploadId);
  }
}
