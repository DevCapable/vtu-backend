import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { CreateAccountDto } from '../create-account.dto';

export class CreateCompanyDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Company Name is required',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'RC Number is required',
  })
  @IsString()
  rcNumber: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Phone Number is required',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Business Category is required',
  })
  @IsNumber()
  businessCategoryId: number;
}
