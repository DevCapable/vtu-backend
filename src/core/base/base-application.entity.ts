import { Column, Index, ManyToOne } from 'typeorm';
import { Account } from '@app/account/entities/account.entity';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { BaseEntity } from '@app/core/base/base.entity';
import { DocumentFile } from '@app/document/entities/document-file.entity';

@Index(['appNumber', 'certificateNumber'])
export abstract class BaseApplicationEntity<T> extends BaseEntity<T> {
  public parent?: T;
  public child?: T;

  @Column({ unique: true })
  appNumber?: string;

  @Column({ nullable: true, unique: true })
  certificateNumber?: string;

  @Column({ nullable: true })
  dateApproved?: Date;

  @Column({ nullable: true })
  dateSubmitted?: Date;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  accountId: number;

  @Column({ enum: AppStatus, default: AppStatus.NOT_SUBMITTED })
  status?: AppStatus;

  @Column({ nullable: true })
  wfCaseId?: string;

  @Column({ nullable: true })
  parentId: number;

  dateDue?: Date;
  isDue?: boolean;
  documentFiles?: DocumentFile[];
  canRenew?: boolean;
}
