import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateAgencyDto,
  CreateCompanyDto,
  CreateIndividualDto,
  CreateOperatorDto,
} from '../dto';
import { AccountTypeEnum } from '../enums';

export const ApiAccountCreate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create an Account',
      description: `Creates an account based on an account type( ${Object.values(
        AccountTypeEnum,
      ).join(', ')})`,
    }),
    ApiExtraModels(
      CreateIndividualDto,
      CreateCompanyDto,
      CreateAgencyDto,
      CreateOperatorDto,
    ),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(CreateIndividualDto),
          },
          {
            $ref: getSchemaPath(CreateCompanyDto),
          },
          {
            $ref: getSchemaPath(CreateAgencyDto),
          },
          {
            $ref: getSchemaPath(CreateOperatorDto),
          },
        ],
      },
    }),
  );
