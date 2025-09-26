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

export interface DocumentFilesInterceptorInterface {
  documentFileType: any;
}

export const DocumentFilesInterceptor = (
  Service: Type<DocumentFilesInterceptorInterface>,
): any => {
  @Injectable()
  class DocumentFilesInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: DocumentFilesInterceptorInterface,
      private readonly documentService: DocumentService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      // for the findall that returns a paginated response, go through the data and add the documentFiles
      return next.handle().pipe(
        map(async (data) => {
          //check if data contains data
          if (data.data) {
            //loop through the data and add the documentFiles
            data.data = await this.documentService.dataWithDocumentFiles(
              data.data,
              this.service.documentFileType,
            );
          } else {
            //if data does not contain data, add the documentFiles
            data.documentFiles = await this.documentService.findFilesByFileable(
              data.id,
              this.service.documentFileType,
            );
          }

          return data;
        }),
      );
    }
  }
  return mixin(DocumentFilesInterceptorClass);
};
