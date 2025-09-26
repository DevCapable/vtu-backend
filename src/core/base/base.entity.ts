import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity<T> {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt?: Date;
}
