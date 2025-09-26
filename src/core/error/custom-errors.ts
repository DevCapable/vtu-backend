import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessageEnum } from './error-message.enum';

interface CustomExceptionConstructor {
  new (
    message?: string,
    code?: string | null,
    data?: Record<string, any>,
  ): HttpException;
}

function customExceptionFactory(
  status: HttpStatus,
  defaultMessage: string,
): CustomExceptionConstructor {
  return class CustomException extends HttpException {
    constructor(
      message?: ErrorMessageEnum,
      code?: string | null,
      data?: Record<string, any>,
    ) {
      super(
        {
          message: message || defaultMessage,
          statusCode: status,
          ...(code && { code }),
          ...data,
        },
        status,
      );
    }
  };
}

const CustomForbiddenException = customExceptionFactory(
  HttpStatus.FORBIDDEN,
  ErrorMessageEnum.ForbiddenDefault,
);

const CustomNotFoundException = customExceptionFactory(
  HttpStatus.NOT_FOUND,
  ErrorMessageEnum.NotFoundDefault,
);

const CustomUnauthorizedException = customExceptionFactory(
  HttpStatus.UNAUTHORIZED,
  ErrorMessageEnum.UnauthorizedDefault,
);

const CustomBadRequestException = customExceptionFactory(
  HttpStatus.BAD_REQUEST,
  ErrorMessageEnum.BadRequestDefault,
);

const CustomUnprocessableEntityException = customExceptionFactory(
  HttpStatus.UNPROCESSABLE_ENTITY,
  ErrorMessageEnum.UnprocessableEntity,
);

const CustomInternalServerException = customExceptionFactory(
  HttpStatus.INTERNAL_SERVER_ERROR,
  ErrorMessageEnum.SomethingWentWrongOnOurEnd,
);

class CustomValidationException extends HttpException {
  constructor(errors?: Record<string, string>) {
    super(
      {
        message: ErrorMessageEnum.ValidationDefault,
        code: 'ERR_INPUT_VALIDATION',
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

class WorkFlowException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export {
  CustomForbiddenException,
  CustomValidationException,
  CustomBadRequestException,
  CustomNotFoundException,
  CustomUnauthorizedException,
  CustomInternalServerException,
  CustomUnprocessableEntityException,
  WorkFlowException,
};
