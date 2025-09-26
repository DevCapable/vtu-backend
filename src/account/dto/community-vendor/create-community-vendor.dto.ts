import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Transform } from 'class-transformer';
import { CreateAccountDto } from '../create-account.dto';

export class CreateCommunityVendorDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Phone Number is required',
  })
  @IsString()
  phoneNumber: string;
}
