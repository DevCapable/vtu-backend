import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from './account.entity';
// import { BaseRecord } from '@app/base-record/entities/base-record.entity';

enum EmploymentStatus {
  EMPLOYED = 'EMPLOYED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  RETIRED = 'RETIRED',
  UNEMPLOYED = 'UNEMPLOYED',
}

@Entity({
  name: 'ACCOUNT_CUSTOMER',
})
export class Customer {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.customer)
  @JoinColumn()
  account: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherNames?: string;

  @Column()
  dob: Date;

  @Column()
  gender: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  countryId?: number;

  // @ManyToOne(() => BaseRecord, {
  //   nullable: true,
  // })
  // country?: BaseRecord;

  @Column()
  nationalityId: number;

  // @ManyToOne(() => BaseRecord)
  // nationality: BaseRecord;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  altPhoneNumber?: string;

  @Column({ length: 1000, nullable: true })
  address?: string;

  @Column({ nullable: true })
  stateId?: number;

  @Column({ nullable: true })
  cityResidence?: string;

  @Column({ nullable: true })
  referralCode?: string;

  @Column({ nullable: true })
  kycStatus?: string;

  // @ManyToOne(() => BaseRecord, { nullable: true })
  // stateResidence?: BaseRecord;

  @Column({ nullable: true })
  photo?: string;

  // @Column({ nullable: true })
  // ninNumber?: string;
}
