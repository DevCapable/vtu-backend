import { ApiProperty } from '@nestjs/swagger';
import { AccountTypeEnum } from '../enums';

export class CreateAccountDto {
  @ApiProperty({
    enum: AccountTypeEnum,
    required: true,
  })
  accountType: AccountTypeEnum;
}
