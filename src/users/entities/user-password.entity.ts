import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPassword extends BaseEntity<UserPassword> {
  @Column()
  expiryDate: Date;

  @Column()
  password: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.passwords)
  user: User;
}
