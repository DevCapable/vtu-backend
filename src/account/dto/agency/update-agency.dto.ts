import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UpdateAccountDto } from '../update-account.dto';
import { CreateAgencyDto } from './create-agency.dto';

export class UpdateAgencyDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateAgencyDto, ['accountType'])),
) {}
