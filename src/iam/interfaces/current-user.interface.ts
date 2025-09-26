import { Account } from '@app/account/entities/account.entity';
import { AccountTypeEnum } from '@app/account/enums';
import { User } from '@app/users/entities/user.entity';

export type JwtPayload = {
  currentAccountId: number;
  currentAccountType: string;
  // currentAccountAgencyPosition: string;
  email: string;
  session?: string;
};

type AccountData = {
  account: { id: number; type: keyof typeof AccountTypeEnum };
  accounts: Account[];
};

export type CurrentUserData = User &
  AccountData & {
    ipAddress: string;
    session?: string;
  };
