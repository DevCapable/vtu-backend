import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/core/base/base.entity';

export enum BaseRecordEnum {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  BUSINESS_CATEGORY = 'BUSINESS_CATEGORY',
  CERTIFICATION_TYPE = 'CERTIFICATION_TYPE',
  CERTIFICATION_CATEGORY = 'CERTIFICATION_CATEGORY',
  COUNTRY = 'COUNTRY',
  COURSE = 'COURSE',
  DISCIPLINE = 'DISCIPLINE',
  EDUCATION_LEVEL = 'EDUCATION_LEVEL',
  DEGREE = 'DEGREE',
  FACILITY = 'FACILITY',
  INSTITUTION = 'INSTITUTION',
  JOB_FAMILY = 'JOB_FAMILY',
  JOB_TYPE = 'JOB_TYPE',
  LGA = 'LGA',
  NATIONALITY = 'NATIONALITY',
  NATURE_OF_EMPLOYMENT = 'NATURE_OF_EMPLOYMENT',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  SERVICE = 'SERVICE',
  SKILL_LEVEL = 'SKILL_LEVEL',
  SKILL_CATEGORY = 'SKILL_CATEGORY',
  STATE = 'STATE',
  MATERIAL_CATEGORY = 'MATERIAL_CATEGORY',
  MEASUREMENT_UNIT = 'MEASUREMENT_UNIT',
  FACILITY_TYPE = 'FACILITY_TYPE',
  EQUIPMENT_CATEGORY = 'EQUIPMENT_CATEGORY',
  WORK_PROGRAMME_TYPE = 'WORK_PROGRAMME_TYPE',
  FISCAL_YEAR = 'FISCAL_YEAR',
  CURRENCY = 'CURRENCY',
  OPERATOR_CATEGORY = 'OPERATOR_CATEGORY',
  PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
  PRODUCT = 'PRODUCT',
  TENDER_CATEGORY = 'TENDER_CATEGORY',
  NCRC_TYPE = 'NCRC_TYPE',
  NCRC_CATEGORY = 'NCRC_CATEGORY',
  NCRC_CAPITALIZATION = 'NCRC_CAPITALIZATION',
  NCRC_PERSONNEL_POSITION = 'NCRC_PERSONNEL_POSITION',
  NCEC_CAPITALIZATION = 'NCEC_CAPITALIZATION',
  NCEC_SINGLE_CONTRACT_EXECUTED = 'NCEC_SINGLE_CONTRACT_EXECUTED',
  NCEC_YEARS_OF_INVESTMENT = 'NCEC_YEARS_OF_INVESTMENT',
  NCEC_OPERATION = 'NCEC_OPERATION',
  MARINE_VESSEL_TYPE = 'MARINE_VESSEL_TYPE',
  TENDER_SERVICE_AREA = 'TENDER_SERVICE_AREA',
  DISCIPLINE_CATEGORY = 'DISCIPLINE_CATEGORY',
}

@Entity('base_records') // explicit table name
export class BaseRecord extends BaseEntity<BaseRecord> {
  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  type: string;

  // Use 'text' for MySQL instead of 'clob'
  @Column({ type: 'text', nullable: true })
  metaData?: string;

  @Column({ type: 'int', nullable: true })
  parentId?: number;

  @ManyToOne(() => BaseRecord, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: BaseRecord;

  @Column({ type: 'varchar', length: 500, nullable: true })
  slug?: string;

  // Use 'tinyint' or 'int' for MySQL; default should be number type
  @Column({ type: 'tinyint', default: 1 })
  isActive?: number;
}
