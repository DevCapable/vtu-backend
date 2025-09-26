import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    type: Array,
  })
  @IsOptional()
  @IsArray()
  format: string[];

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  order: boolean;
}
