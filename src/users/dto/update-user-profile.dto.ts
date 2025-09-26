import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    type: String,
    description: 'first name',
  })
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'last name',
  })
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  lastName: string;

  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    type: Boolean,
    description: 'isFirstLogin',
  })
  @IsOptional()
  @IsBoolean({ message: 'isFirstLogin must be a boolean value.' })
  isFirstLogin: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'isActivated',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActivated must be a boolean value.' })
  isActivated: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'istermsAccepted',
  })
  @IsOptional()
  @IsBoolean({ message: 'istermsAccepted must be a boolean value.' })
  istermsAccepted: boolean;
}
