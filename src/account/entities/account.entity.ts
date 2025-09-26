import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { AccountTypeEnum } from '../enums';
import { Admin } from './admin.entity';
import { Customer } from './customer.entity';
import { User } from '@app/users/entities/user.entity';

@Entity()
export class Account extends BaseEntity<Account> {
  @Column({
    length: 50,
  })
  type: AccountTypeEnum;

  @Column({ length: 255, nullable: true })
  bio?: string;

  @Column({
    nullable: true,
  })
  oldId?: number;

  @Column()
  nogicNumber: string;

  @Column({ default: true })
  active: boolean;

  // @Column({
  //   enum: ExternalLinkOriginEnum,
  //   default: ExternalLinkOriginEnum.NOGIC,
  // })
  // origin: ExternalLinkOriginEnum;

  @OneToOne(() => Customer, (customer) => customer.account, {
    cascade: true,
  })
  customer: Customer;

  @OneToOne(() => Admin, (admin) => admin.account, { cascade: true })
  admin: Admin;

  @ManyToMany(() => User, (user) => user.accounts, { cascade: true })
  @JoinTable({
    name: 'account_users',
  })
  users: User[];

  name: string;
}
