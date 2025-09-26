import { BaseEntity } from '@app/core/base/base.entity';
import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { Permission } from '@app/permission/entities/permission.entity';
import { User } from '@app/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntity<Role> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ default: false })
  special: boolean;

  @Column({
    type: 'varchar2',
    enum: ExternalLinkOriginEnum,
    default: ExternalLinkOriginEnum.NOGIC,
  })
  origin: ExternalLinkOriginEnum;

  @Column({ nullable: true })
  accountId?: number;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  userCount: number;
}
