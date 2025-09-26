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
  name: 'ACCOUNT_INDIVIDUALS',
})
export class Individual {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.individual)
  @JoinColumn()
  account: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherNames?: string;

  @Column({ default: false, width: 0 })
  isExpatriate: boolean;

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
  altEmail?: string;

  @Column({ nullable: true })
  altPhoneNumber?: string;

  @Column({ length: 1000, nullable: true })
  address?: string;

  @Column({ nullable: true })
  stateId?: number;

  // @ManyToOne(() => BaseRecord, {
  //   nullable: true,
  // })
  // state?: BaseRecord;

  @Column({ nullable: true })
  cityResidence?: string;

  @Column({ nullable: true })
  stateResidenceForeign?: string;

  @Column({ nullable: true })
  stateResidenceId?: number;

  // @ManyToOne(() => BaseRecord, { nullable: true })
  // stateResidence?: BaseRecord;

  @Column({ nullable: true })
  lgaId?: number;

  // @ManyToOne(() => BaseRecord)
  // lga?: BaseRecord;

  @Column({ nullable: true })
  homeTown?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  employmentStatus?: EmploymentStatus;

  @Column({ nullable: true })
  currentEmployer?: string;

  @Column({ nullable: true })
  dateEmployed?: Date;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  ninNumber?: string;

  @Column({ nullable: true })
  competencyId?: string;
}
