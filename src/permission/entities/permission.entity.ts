import { BaseEntity } from '@app/core/base/base.entity';
import { Role } from '@app/role/entities/role.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { PermissionGroup } from './permission-group.entity';
import { User } from '@app/users/entities/user.entity';

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
    default: false,
    width: 1,
  })
  inverted: boolean;

  @Column({ nullable: true })
  conditions?: string;

  @Column({ nullable: true })
  reason?: string;

  // @Column({
  //   type: 'varchar2',
  //   enum: ExternalLinkOriginEnum,
  //   default: ExternalLinkOriginEnum.NOGIC,
  // })
  // origin: ExternalLinkOriginEnum;

  @Column()
  permissionGroupId: number;

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.permissions,
  )
  permissionGroup: PermissionGroup;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Column({ width: 0, default: false })
  isSpecial: boolean;

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];
}
