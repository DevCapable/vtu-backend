import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseRecordEnum } from '../entities/base-record.entity';

export class CreateBaseRecordDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Invalid character' })
  name: string;

  @ApiProperty({
    description: 'enum',
    enum: BaseRecordEnum,
  })
  @IsEnum(BaseRecordEnum, { each: true })
  type: BaseRecordEnum;

  @ApiProperty({
    type: Number,
    description: '',
  })
  @IsOptional()
  @IsNumber()
  parentId: number;
}
