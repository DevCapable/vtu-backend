import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  UpdateAgencyDto,
  UpdateCompanyDto,
  UpdateIndividualDto,
  UpdateOperatorDto,
} from '../dto';

export const ApiAccountUpdate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update Authenticated Account Profile',
    }),
    ApiExtraModels(
      UpdateIndividualDto,
      UpdateCompanyDto,
      UpdateAgencyDto,
      UpdateOperatorDto,
    ),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(UpdateIndividualDto),
          },
          {
            $ref: getSchemaPath(UpdateCompanyDto),
          },
          {
            $ref: getSchemaPath(UpdateAgencyDto),
          },
          {
            $ref: getSchemaPath(UpdateOperatorDto),
          },
        ],
      },
    }),
  );
