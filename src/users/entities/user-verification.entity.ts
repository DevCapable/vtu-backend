import { BaseEntity } from '@app/core/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserVerification extends BaseEntity<UserVerification> {
  @Column()
  token: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;
}
