import { BaseEntity } from '@app/core/base/base.entity';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { User } from '@app/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { AccountTypeEnum } from '../enums';
import { Agency } from './agency.entity';
import { CommunityVendor } from './community-vendor.entity';
import { Company } from './company.entity';
import { Individual } from './individual.entity';
import { Operator } from './operator.entity';

@Entity()
export class Account extends BaseEntity<Account> {
  @Column({
    type: 'varchar',
    length: 50,
  })
  type: AccountTypeEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;

  @Column({
    nullable: true,
  })
  oldId?: number;

  @Column()
  nogicNumber: string;

  @Column({ default: true })
  active: boolean;

  @Column({
    type: 'varchar2',
    enum: ExternalLinkOriginEnum,
    default: ExternalLinkOriginEnum.NOGIC,
  })
  origin: ExternalLinkOriginEnum;

  @OneToOne(() => Individual, (individual) => individual.account, {
    cascade: true,
  })
  individual: Individual;

  @OneToOne(() => Agency, (agency) => agency.account, { cascade: true })
  agency: Agency;

  @OneToOne(() => Company, (company) => company.account, { cascade: true })
  company: Company;

  @OneToOne(() => Operator, (operator) => operator.account, { cascade: true })
  operator: Operator;

  @OneToOne(
    () => CommunityVendor,
    (communityVendor) => communityVendor.account,
    { cascade: true },
  )
  communityVendor: CommunityVendor;

  @ManyToMany(() => User, (user) => user.accounts, { cascade: true })
  @JoinTable({
    name: 'account_users',
  })
  users: User[];

  name: string;
}
