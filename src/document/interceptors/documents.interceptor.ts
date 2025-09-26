import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Inject,
  Type,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DocumentService } from '@app/document/document.service';
import { CustomNotFoundException } from '@app/core/error';

export interface DocumentsInterceptorInterface {
  findOne(id: number): Promise<any>;
  getDocumentType(type: string): any;
  documentFileType: any;
  transformDocuments(documents: any, type: string | undefined): any;
}

export const DocumentsInterceptor = (
  Service: Type<DocumentsInterceptorInterface>,
): any => {
  @Injectable()
  class DocumentsInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: DocumentsInterceptorInterface,
      private readonly documentService: DocumentService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const appId = parseInt(request.query.id, 10) || null;
      const type = request.query.type;
      const currentUser = request.user;

      if (appId) {
        const app = await this.service.findOne(appId);

        if (!app) {
          throw new CustomNotFoundException('Application not found');
        }
      }

      // check if getDocumentType exists in the service
      if (!this.service.getDocumentType) {
        throw new CustomNotFoundException(
          `getDocumentType Method not found in ${Service.name}`,
        );
      }

      let documents: any;
      const documentType = this.service.getDocumentType(type);
      const documentFileType = this.service.documentFileType;

      if (!documentType) {
        throw new CustomNotFoundException('Document type not found');
      }

      if (!appId) {
        documents =
          await this.documentService.findDocumentsByType(documentType);
      } else {
        documents =
          await this.documentService.findDocumentWithFilesByTypeAndFileable({
            fileableId: appId,
            fileableType: documentFileType,
            documentType,
            currentUser,
          });
      }

      if (this.service.transformDocuments) {
        documents = this.service.transformDocuments(documents, type);
      }

      return next.handle().pipe(
        map(() => {
          return Promise.resolve(documents);
        }),
      );
    }
  }
  return mixin(DocumentsInterceptorClass);
};
