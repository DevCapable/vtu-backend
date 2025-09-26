import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  isSuccess: boolean;

  @CreateDateColumn()
  createdAt?: Date;
}
