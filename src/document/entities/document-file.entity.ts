import { Entity, Column, ManyToOne } from 'typeorm';
import { Document } from './document.entity'; // Import the Document entity if not in the same file
import { BaseEntity } from '@app/core/base/base.entity';

@Entity()
export class DocumentFile extends BaseEntity<DocumentFile> {
  @Column()
  filePath: string;

  @Column()
  awsKey: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  documentId: number;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  document: Document;

  @Column()
  fileableId: number;

  @Column()
  fileableType: string;
}
