import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

enum ACCOUNTTYPE {
  AGENCY = 'AGENCY',
  COMPANY = 'COMPANY',
  OPERATOR = 'OPERATOR',
}

export enum GROUPTYPE {
  MARINE_VESSEL = 'MARINE_VESSEL',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  NCTRC = 'NCTRC',
  ADVERT = 'ADVERT',
}

@Entity()
export class PermissionGroup extends BaseEntity<PermissionGroup> {
  @OneToMany(() => Permission, (permission) => permission.permissionGroup)
  permissions: Permission[];

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  type: ACCOUNTTYPE;

  @Column({
    nullable: true,
  })
  slug: GROUPTYPE;

  @Column({ nullable: true })
  parentId: string;
}
