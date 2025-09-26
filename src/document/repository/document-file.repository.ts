import { Injectable } from '@nestjs/common';
// import { DocumentFile } from '../entities/document-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@app/core/base/base.repository';
import { DocumentFile } from '../entities/document-file.entity';

@Injectable()
export class DocumentFileRepository extends BaseRepository<DocumentFile> {
  public fillable = [
    'documentId',
    'fileableId',
    'fileableType',
    'awsKey',
    'filePath',
    'mimeType',
    'size',
    'documentId',
    'fileableId',
    'fileableType',
    'uuid',
  ];

  constructor(
    @InjectRepository(DocumentFile)
    private readonly documentFileRepository: Repository<DocumentFile>,
  ) {
    super(documentFileRepository);
  }

  async getDocumentFile(fileableId: number, fileableType: string) {
    return await this.documentFileRepository.find({
      where: {
        fileableId,
        fileableType,
      },
      relations: {
        document: true,
      },
    });
  }

  async delete(awsKey: string): Promise<any> {
    const queryBuilder = this.documentFileRepository.createQueryBuilder();
    return queryBuilder
      .delete()
      .where('awsKey = :awsKey', { awsKey })
      .execute();
  }

  async deleteMany(awsKeys) {
    const queryBuilder = this.documentFileRepository.createQueryBuilder();
    return queryBuilder
      .delete()
      .from(DocumentFile)
      .where('awsKey IN (:...awsKeys)', { awsKeys })
      .execute();
  }
}
