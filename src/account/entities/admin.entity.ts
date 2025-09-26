import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity({
  name: 'ACCOUNT_ADMIN',
})
export class Admin {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  account: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherNames?: string;

  @Column({ nullable: true })
  phoneNumber?: string;
}
