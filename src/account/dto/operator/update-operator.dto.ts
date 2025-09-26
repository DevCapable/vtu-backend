import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CreateOperatorDto } from './create-operator.dto';
import { UpdateAccountDto } from '../update-account.dto';

export class UpdateOperatorDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateOperatorDto, ['accountType'])),
) {}
