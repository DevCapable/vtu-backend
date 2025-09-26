import { BaseEntity } from '@app/core/base/base.entity';
import { Role } from '@app/role/entities/role.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { PermissionGroup } from './permission-group.entity';
import { User } from '@app/user/entities/user.entity';
import { ExternalLinkOriginEnum } from '@app/iam/enum';

@Entity()
export class Permission extends BaseEntity<Permission> {
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @Column()
  title: string;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column({
    type: 'number',
    default: false,
    width: 1,
  })
  inverted: boolean;

  @Column({ type: 'clob', nullable: true })
  conditions?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({
    type: 'varchar2',
    enum: ExternalLinkOriginEnum,
    default: ExternalLinkOriginEnum.NOGIC,
  })
  origin: ExternalLinkOriginEnum;

  @Column()
  permissionGroupId: number;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.permissions,
  )
  permissionGroup: PermissionGroup;

  @Column({ type: 'date', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'number', width: 0, default: false })
  isSpecial: boolean;

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];
}
