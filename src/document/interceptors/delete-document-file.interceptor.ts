import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Inject,
  Type,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DocumentService } from '@app/document/document.service';

export interface DeleteDocumentFileInterceptorInterface {
  documentFileType: any;
}

export const DeleteDocumentFileInterceptor = (
  Service: Type<DeleteDocumentFileInterceptorInterface>,
  isMultiple = false,
): any => {
  @Injectable()
  class CreateDocumentFileInterceptorClass implements NestInterceptor {
    constructor(
      @Inject(Service)
      private readonly service: DeleteDocumentFileInterceptorInterface,
      private readonly documentService: DocumentService,
    ) {}
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      if (isMultiple) {
        const { ids } = request.body;
        return next.handle().pipe(
          tap(async () => {
            await Promise.all(
              ids.map(async (id: number) => {
                await this.documentService.deleteDocumentFileByFileable(
                  id,
                  this.service.documentFileType,
                );
              }),
            );
          }),
        );
      }

      return next.handle().pipe(
        tap(async () => {
          const { id } = request.params;
          await this.documentService.deleteDocumentFileByFileable(
            id,
            this.service.documentFileType,
          );
        }),
      );
    }
  }
  return mixin(CreateDocumentFileInterceptorClass);
};
