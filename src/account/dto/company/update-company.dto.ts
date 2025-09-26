import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';
import { UpdateAccountDto } from '../update-account.dto';

export class UpdateCompanyDto extends IntersectionType(
  PickType(UpdateAccountDto, ['id']),
  PartialType(OmitType(CreateCompanyDto, ['accountType'])),
) {
  @ApiProperty({
    description: 'photos',
    required: false,
    type: Array,
  })
  @IsOptional()
  photos: any;
}
