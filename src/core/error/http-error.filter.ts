import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import * as Sentry from '@sentry/nestjs';
import { ExceptionHelper } from './helper';
import { ErrorMessageEnum } from './error-message.enum';
import { LoggerService } from '../../logger/logger.service';
import { CurrentUserData } from '@app/iam/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger: LoggerService;
  constructor() {
    this.logger = new LoggerService();
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const currentUser = request?.user as CurrentUserData;

    let status: number;
    let errorResponse: Record<string, any> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as object;
    } else {
      const isDbError = ExceptionHelper.isOracleDbError(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      const message = isDbError
        ? ExceptionHelper.getOracleDbErrorMessage(exception)
        : ErrorMessageEnum.SomethingWentWrongOnOurEnd;

      errorResponse = {
        statusCode: status,
        message,
      };
    }

    if (ExceptionHelper.shouldCaptureExceptionInSentry(exception))
      Sentry.captureException(exception);

    let logMessage = `${request.method} ${request.url} ${status} - ${exception.message} `;

    if (currentUser)
      logMessage = `${logMessage} - user: ${JSON.stringify({ email: currentUser?.email, name: currentUser?.firstName })}`;

    this.logger.error(logMessage);

    response.status(status).json(errorResponse);
  }
}
