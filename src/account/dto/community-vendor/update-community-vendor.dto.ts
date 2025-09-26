import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UpdateAccountDto } from '../update-account.dto';
import { CreateCommunityVendorDto } from './create-community-vendor.dto';

export class UpdateCommunityVendorDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateCommunityVendorDto, ['accountType'])),
) {}
