import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UpdateAccountDto } from '../update-account.dto';
import { CreateIndividualDto } from './create-individual.dto';

export class UpdateIndividualDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateIndividualDto, ['accountType'])),
) {}
