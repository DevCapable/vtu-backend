import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { AccountTypeEnum } from '@app/account/enums';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Account;
  }

  afterLoad(entity: Account): Promise<any> | void {
    let name = '';
    switch (entity.type) {
      case AccountTypeEnum.CUSTOMER:
        name = `${entity.customer?.firstName} ${entity.customer?.lastName}`;
        break;
      case AccountTypeEnum.ADMIN:
        name = `${entity.customer?.firstName} ${entity.customer?.lastName}`;
        break;
    }
    entity.name = name;
  }
}
