import { Account } from '@app/account/entities/account.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/core/base/base.entity';
import { Role } from '@app/role/entities/role.entity';
import { UserPassword } from './user-password.entity';
import { Exclude } from 'class-transformer';
// import { DocumentReview } from '@app/review/entities/document-review.entity';
import { Permission } from '@app/permission/entities/permission.entity';

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({
    nullable: true,
  })
  password: string;

  @Column()
  nogicNumber: string;

  @Column({ width: 0, nullable: true })
  isFirstLogin?: boolean;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Exclude()
  @Column({ nullable: true })
  deletedAt?: Date;

  @Exclude()
  @Column({ nullable: true })
  hashedRt?: string;

  @Column({ default: false })
  isActivated?: boolean;

  @Column({ default: false })
  isTermsAccepted?: boolean;

  @Column({ default: true })
  isPasswordReset?: boolean;

  // @OneToMany(() => Review, (review) => review.reviewer)
  // reviews: Review[];

  @ManyToMany(() => Role, (role: Role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_permissions',
  })
  permissions: Permission[];

  @Column({ nullable: true })
  wfUserId?: string;

  @Exclude()
  @Column({ nullable: true })
  wfUserPassword?: string;

  @OneToMany(() => UserPassword, (userPassword) => userPassword.user)
  passwords: UserPassword[];

  @ManyToMany(() => Account, (account) => account.users)
  accounts: Account[];

  // @OneToMany(() => DocumentReview, (documentReview) => documentReview.reviewer)
  // documentReviews: DocumentReview[];
}
