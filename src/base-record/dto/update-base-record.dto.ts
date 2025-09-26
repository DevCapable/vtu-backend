import { PartialType } from '@nestjs/mapped-types';
import { CreateBaseRecordDto } from './create-base-record.dto';

export class UpdateBaseRecordDto extends PartialType(CreateBaseRecordDto) {}
