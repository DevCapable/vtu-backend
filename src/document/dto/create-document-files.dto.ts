import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DocumentFile } from '../types';

export class CreateDocumentFilesDto {
  @ApiProperty({
    type: Array,
  })
  @IsNotEmpty()
  documentFiles: DocumentFile[];

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  fileableId: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fileableType: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
