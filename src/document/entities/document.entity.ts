import { BaseEntity } from '@app/core/base/base.entity';
import { Entity, Column } from 'typeorm';
import { DocumentDomain } from '../types';

@Entity()
export class Document extends BaseEntity<Document> {
  @Column({ length: 1000 })
  name: string;

  @Column({ length: 250, unique: true })
  slug: string;

  @Column({ length: 250 })
  type: string;

  @Column({ default: 0 })
  isRequired: number;

  @Column({ type: 'clob', nullable: true })
  allowedFormats: string | null;

  @Column({ nullable: true, type: 'clob' })
  description: string | null;

  @Column({ default: 0 })
  order: number;

  @Column({ enum: DocumentDomain, default: DocumentDomain.NOGIC })
  domain: DocumentDomain;
}
