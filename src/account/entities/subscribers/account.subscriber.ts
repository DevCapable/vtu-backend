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
      case AccountTypeEnum.INDIVIDUAL:
        name = `${entity.individual?.firstName} ${entity.individual?.lastName}`;
        break;
      case AccountTypeEnum.COMPANY:
        name = entity.company?.name;
        break;
      case AccountTypeEnum.OPERATOR:
        name = entity.operator?.name;
        break;
      case AccountTypeEnum.AGENCY:
        name = `${entity.agency?.firstName} ${entity.agency?.lastName}`;
        break;
    }
    entity.name = name;
  }
}
