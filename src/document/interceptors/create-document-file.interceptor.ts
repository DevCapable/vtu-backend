import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Inject,
  Type,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { DocumentService } from '@app/document/document.service';
import { pick } from '@app/core/util';
import { DocumentType } from '@app/document/enum/document.enum';
import { CustomNotFoundException } from '@app/core/error';

export interface CreateDocumentFileInterceptorInterface {
  findOne(id: number): Promise<any>;
  documentFileType: any;
  getDocumentType(type: string): any;
  validateCreateDocumentFile?(
    entityId: number,
    documentType?: DocumentType,
  ): Promise<void>;
}

export const CreateDocumentFileInterceptor = (
  Service: Type<CreateDocumentFileInterceptorInterface>,
): any => {
  @Injectable()
  class CreateDocumentFileInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: CreateDocumentFileInterceptorInterface,
      private readonly documentService: DocumentService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const { id } = request.params;
      const { documentFiles, type } = request.body;

      if (!documentFiles) return next.handle();

      return next.handle().pipe(
        switchMap(async (savedEntity) => {
          // check if the entity exists, if it does not exist it means it is a create document request, hence we need to validate the entity
          if (!savedEntity) {
            const documentType = this.service.getDocumentType(type);
            // TODO enforce that all services that use this interceptor must implement validateCreateDocumentFile
            if (this.service.validateCreateDocumentFile) {
              await this.service.validateCreateDocumentFile(
                parseInt(id),
                documentType,
              );
            }
          }

          let entityId = savedEntity?.id || id;
          const [entity] = await Promise.all([this.service.findOne(entityId)]);

          if (!entity)
            throw new CustomNotFoundException('Application not found');

          entityId = entity.id;

          let filteredDocumentFiles = documentFiles;

          // check if it is a create request, this is basically used to create documents for renewals
          if (parseInt(id) !== entityId) {
            filteredDocumentFiles = documentFiles?.map((item: any) => {
              return pick(item, [
                'filePath',
                'size',
                'awsKey',
                'mimeType',
                'documentId',
              ]);
            });
          }

          await this.documentService.createDocumentFilesByFileable(
            filteredDocumentFiles,
            entityId,
            this.service.documentFileType,
          );

          return savedEntity || entity || null;
        }),
      );
    }
  }
  return mixin(CreateDocumentFileInterceptorClass);
};
