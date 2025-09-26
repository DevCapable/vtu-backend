import { Module } from '@nestjs/common';
import { DocumentRepository, DocumentFileRepository } from './repository';
import DocumentsController from './document.controller';
import { DocumentService } from './document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentFile } from './entities/document-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentFile])],
  controllers: [DocumentsController],
  providers: [
    DocumentService,
    DocumentRepository,
    DocumentFileRepository,
    // S3Service,
  ],
  exports: [DocumentService, DocumentFileRepository],
})
export class DocumentModule {}
