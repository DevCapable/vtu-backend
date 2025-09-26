import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@app/document/repository';
import { DocumentFileRepository } from '@app/document/repository';
import { unlink } from 'fs';
import { cwd } from 'process';
import { join } from 'path';
import { EntityManager, ILike } from 'typeorm';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { DocumentType } from '@app/document/enum/document.enum';
import { ConfigService } from '@nestjs/config';
import { NcecApplication } from '@app/ncec/entities/ncec.entity';
import { DocumentFile } from '@app/document/entities/document-file.entity';
import { CustomNotFoundException } from '@app/core/error';
import { LoggerService } from '@app/logger';
import { StringHelper } from '@app/core/helpers';

import { AccountTypeEnum } from '@app/account/enums';
import { DocumentReviewService } from '@app/review/document-review.service';
import { CurrentUserData } from '@app/iam/interfaces';

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentFileRepository: DocumentFileRepository,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
    private readonly documentReviewService: DocumentReviewService,
  ) {}

  async uploadDocumentData(files, folder = 'files') {
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.s3Service.uploadFile(file, folder),
      );
      const uploadResults = await Promise.all(uploadPromises);
      return uploadResults;
    }
  }

  async createDocumentFiles(data) {
    data.documentFiles.map(async (document) => {
      await this.documentFileRepository.create({
        ...document,
        fileableId: data.fileableId,
        fileableType: data.fileableType,
        documentId: data.documentId,
        uuid: uuidv4(),
      });
    });
  }

  async createDocumentFile(documents, fileableId, fileableType) {
    const reference = documents.map((document) => document.id);
    documents.map(async (document) => {
      if (!document.id) {
        try {
          const newDocumentFile = await this.documentFileRepository.create({
            ...document,
            fileableId,
            fileableType,
            uuid: uuidv4(),
          });
          reference.push(newDocumentFile.id);
        } catch (e) {
          this.loggerService.log(e);
        }
      }
    });

    return reference;
  }

  async getDocumentById(documentId: number) {
    const file = await this.documentRepository.findById(documentId);
    if (!file) {
      throw new CustomNotFoundException();
    }
    return file;
  }

  async findFilesByFileable(fileableId: number, fileableType: string) {
    const documentFiles = await this.documentFileRepository.getDocumentFile(
      fileableId,
      fileableType,
    );

    return await Promise.all(
      documentFiles.map((file) => this._transformDocumentFile(file)),
    );
  }

  async deleteDocumentFileByFileable(fileableId: number, fileableType: string) {
    const documentFiles = await this.documentFileRepository.getDocumentFile(
      fileableId,
      fileableType,
    );

    if (documentFiles.length) {
      await this.deleteManyDocumentFiles(
        documentFiles.map((file) => file.awsKey),
      );
    }
  }

  async createDocumentFilesByFileable(
    documentFiles: Document[],
    fileableId: number,
    fileableType: string,
  ) {
    if (documentFiles && documentFiles.length) {
      await this.createDocumentFile(documentFiles, fileableId, fileableType);
    }
  }

  async deleteDocumentFile(key: string) {
    try {
      await this.documentFileRepository.delete(key);
      await this.s3Service.deleteFile(key);
    } catch (e) {
      await this.s3Service.deleteFile(key);
    }
  }

  async deleteManyDocumentFiles(keys: string[]) {
    await this.documentFileRepository.deleteMany(keys);
    keys.map(async (key) => {
      await this.s3Service.deleteFile(key);
    });
  }

  async unlinkDocumentFile(filePath: string) {
    const documentPath = join(cwd(), `public/uploads/${filePath}`);
    unlink(documentPath, (err) => {
      if (err)
        this.loggerService.error('Error deleting document file', err.message);
    });
  }

  async dataWithDocumentFiles(data, fileableType: string) {
    return await Promise.all(
      data.map(async (item) => {
        const documentFiles = await this.findFilesByFileable(
          item.id,
          fileableType,
        );
        return { ...item, documentFiles };
      }),
    );
  }

  async dataWithPhotoFiles(data, fileableType: string) {
    return await Promise.all(
      data.map(async (item) => {
        const photos = await this.findFilesByFileable(item.id, fileableType);
        return { ...item, photos };
      }),
    );
  }

  async findDocumentsByType(type: DocumentType | DocumentType[]) {
    return await this.documentRepository.findAllByType(type);
  }

  async findDocumentWithFilesByTypeAndFileable({
    documentType,
    fileableId,
    fileableType,
    currentUser,
  }: {
    documentType: DocumentType | DocumentType[];
    fileableId: number;
    fileableType: string;
    currentUser?: CurrentUserData;
  }) {
    const isAgencyAccount =
      currentUser?.account?.type === AccountTypeEnum.AGENCY;

    let documentReviews = [];

    const documents = await this.findDocumentsByType(documentType);
    const documentFiles = await this.findFilesByFileable(
      fileableId,
      fileableType,
    );

    if (isAgencyAccount) {
      documentReviews = await this.documentReviewService.findDocumentReviews(
        fileableId,
        fileableType,
      );
    }

    return documents.map((document) => {
      const files = documentFiles.filter(
        (file) => file.documentId === document.id,
      );

      const reviews =
        documentReviews.filter((review) => review.documentId === document.id) ||
        [];

      return { ...document, documentFiles: files, reviews };
    });
  }

  async findDocumentsByTypeAndSlug(type: string, slug: string) {
    return this.documentRepository.findAllBy({
      type: type,
      slug: ILike(`%${slug}%`),
    });
  }

  async findAll(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.documentRepository.findAll(
      filterOptions,
      paginationOptions,
    );

    const mappedData = data.map((item) => {
      return {
        ...item,
        allowedFormats: item.allowedFormats
          ? JSON.parse(item.allowedFormats)
          : [],
      };
    });

    return { data: mappedData, totalCount };
  }

  async create(data) {
    data.slug = StringHelper.slugify(data.name + data.type);
    data.allowedFormats = StringHelper.stringify(data.allowedFormats);
    return await this.documentRepository.create({ ...data, uuid: uuidv4() });
  }

  async update(id: number, data) {
    data.allowedFormats = StringHelper.stringify(data.allowedFormats);

    return await this.documentRepository.update(id, data);
  }

  async findOne(id: number) {
    return this.documentRepository.findById(id);
  }

  async delete(id: number) {
    return this.documentRepository.delete(id);
  }

  private async _transformDocumentFile(file: DocumentFile) {
    const basePath = this.configService.get('S3_BASE_URL');

    const folderMappings: any = {
      OWNERSHIP_DOCUMENT: 'ownership-documents',
      NCRC: 'ncrc',
      NCEC: 'ncec',
      MARINE_VESSEL: 'marine-vessel',
      EQ_APPLICATION: 'expatriate-quota',
      TWP_APPLICATION: 'twp-app',
      TWP_REQUEST: 'twp',
      EP_APPLICATION: 'exchange-program-app',
      EP_REQUEST: 'exchange-program',
    };

    let filePath = `${basePath}files/${file.awsKey.replace('files/', '')}`;

    let folder = folderMappings[file?.fileableType as any] || null;

    if (!file.mimeType && folder) {
      if (folder === 'ncec') {
        const app = await this.entityManager.findOne(NcecApplication, {
          where: {
            id: file.fileableId,
          },
          relations: {
            category: true,
          },
        });

        if (app?.category) {
          const categoryCode = app.category.code?.toLowerCase();
          folder = `ncec-category-${categoryCode}`;
        }
      }

      filePath = `${basePath}generic_documents/${folder}/${file.awsKey}`;
    }

    return {
      ...file,
      filePath,
    };
  }
}
