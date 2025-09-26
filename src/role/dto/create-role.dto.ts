import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    description: 'Role Name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Role Description',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: Array,
    required: false,
  })
  @IsOptional()
  public permissions: number[];
}
