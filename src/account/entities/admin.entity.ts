import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

export enum Position {
  PO = 'PO',
  SP = 'SP',
  MGR = 'MGR',
  DMGR = 'DMGR',
  GM = 'GM',
  DIR = 'DIR',
  ES = 'ES',
}

@Entity({
  name: 'ACCOUNT_AGENCY',
})
export class Agency {
  @PrimaryColumn()
  accountId: number;

  @OneToOne(() => Account, (account) => account.agency, {
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

  @Column({
    type: 'varchar',
    length: 50,
  })
  position: Position;

  @Column({ nullable: true })
  workflowGroups: string;
}
