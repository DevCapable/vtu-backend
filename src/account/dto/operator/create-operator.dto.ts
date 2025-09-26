import { PickType, ApiProperty } from '@nestjs/swagger';
import { CreateAccountDto } from '../create-account.dto';
import { AccountTypeEnum } from '../../enums';

export class CreateOperatorDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    enum: AccountTypeEnum,
  })
  accountType: AccountTypeEnum;
}
