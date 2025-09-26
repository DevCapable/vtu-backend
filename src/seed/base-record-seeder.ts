import {
  BaseRecord,
  BaseRecordEnum,
} from '../base-record/entities/base-record.entity';
import ProductCategory from './raw-data/dump/e-market/product-category.dump.json';
import Product from './raw-data/dump/e-market/product.dump.json';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from './seeder.interface';
import { convertCSVToObject, removeSpecialCharacters } from '../core/util';
import { join } from 'path';
import { BaseRecordType } from '@app/base-record/type/base-record.type';
import { BaseRecordRepository } from '@app/base-record/base-record.repository';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { StringHelper } from '@app/core/helpers';

const sluggables = [
  BaseRecordEnum.STATE,
  BaseRecordEnum.NATIONALITY,
  BaseRecordEnum.COUNTRY,
  BaseRecordEnum.BUSINESS_CATEGORY,
  BaseRecordEnum.OPERATOR_CATEGORY,
];

@Injectable()
export class BaseRecordSeeder implements SeederInterface {
  constructor(
    @InjectRepository(BaseRecord)
    private readonly baseRecord: Repository<BaseRecord>,
    private readonly baseRecordRepository: BaseRecordRepository,
    // private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async checkIfTypeExists(type) {
    const [data, count] = await this.baseRecord.findAndCount({
      where: {
        type,
      },
    });

    return count > 0;
  }

  csvFilePath(path) {
    return join(
      __dirname,
      '../../../src/seed',
      'raw-data',
      'dump',
      'csvs',
      `${path}`,
    );
  }

  async baseRecordSkeleton(type) {
    if (await this.checkIfTypeExists(type)) return;

    const data = await convertCSVToObject(
      this.csvFilePath(`${type.toLowerCase()}.csv`),
    );

    data.map(async (data) => {
      if (!data.name) return;

      const slug = StringHelper.slugify(`${data.name}`);
      const baseRecordData = {
        uuid: uuidv4(),
        name: removeSpecialCharacters(data.name).toUpperCase().trim(),
        type: BaseRecordEnum[type],
        parentId: 0,
      };

      if (sluggables.includes(BaseRecordEnum[type])) {
        baseRecordData['slug'] = slug;
      }

      await this.baseRecord.save(baseRecordData);
    });
  }

  async baseRecordSkeletonForLga() {
    if (await this.checkIfTypeExists(BaseRecordEnum.LGA)) return;
    const data = await convertCSVToObject(this.csvFilePath('lga.csv'));

    data.map(async (data) => {
      const state = await this.baseRecord.findOne({
        where: {
          slug: StringHelper.slugify(data.state),
        },
      });

      if (state) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          name: removeSpecialCharacters(data.name).toUpperCase().trim(),
          type: BaseRecordEnum.LGA,
          parentId: state.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordSkeletonForService() {
    if (await this.checkIfTypeExists(BaseRecordEnum.SERVICE)) return;
    const data = await convertCSVToObject(this.csvFilePath('service.csv'));
    data.map(async (data) => {
      const category = await this.baseRecordRepository.findFirstBy({
        name: data.category,
      });
      if (category) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          name: removeSpecialCharacters(data.name).toUpperCase().trim(),
          type: BaseRecordEnum.SERVICE,
          parentId: category?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordSkeletonForCourse() {
    if (await this.checkIfTypeExists(BaseRecordEnum.COURSE)) return;
    const data = await convertCSVToObject(this.csvFilePath('course.csv'));
    data.map(async (data) => {
      const discipline = await this.baseRecordRepository.findFirstBy({
        name: data.discipline,
      });
      if (discipline) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          name: removeSpecialCharacters(data.name).toUpperCase().trim(),
          type: BaseRecordType.COURSE,
          parentId: discipline?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordSkeletonForDegree() {
    const data = await convertCSVToObject(this.csvFilePath('degree.csv'));

    data.map(async (data) => {
      const eductationLevel = await this.baseRecordRepository.findFirstBy({
        name: removeSpecialCharacters(data.edu_level).toUpperCase().trim(),
      });

      if (eductationLevel) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          isActive: 1,
          name: removeSpecialCharacters(data.name).toLowerCase().trim(),
          type: BaseRecordEnum.DEGREE,
          parentId: eductationLevel?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordSkeletonForCertificationType() {
    if (await this.checkIfTypeExists(BaseRecordEnum.CERTIFICATION_TYPE)) return;
    const data = await convertCSVToObject(
      this.csvFilePath('certification_type.csv'),
    );
    data.map(async (data) => {
      const category = await this.baseRecordRepository.findFirstBy({
        name: data.category,
      });
      if (category) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          name: removeSpecialCharacters(data.name).toUpperCase().trim(),
          type: BaseRecordEnum.CERTIFICATION_TYPE,
          parentId: category?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordForProductCategory() {
    if (await this.checkIfTypeExists(BaseRecordEnum.PRODUCT_CATEGORY)) return;
    ProductCategory.map(async (data) => {
      const baseRecordData = {
        uuid: uuidv4(),
        name: removeSpecialCharacters(data.name).toUpperCase().trim(),
        type: data.type,
        parentId: 0,
      };
      const record = this.baseRecord.create(baseRecordData);
      await this.baseRecord.save(record);
    });
  }

  async baseRecordForProductType() {
    if (await this.checkIfTypeExists(BaseRecordEnum.PRODUCT)) return;
    Product.map(async (data) => {
      const product = await this.baseRecord.findOne({
        where: {
          slug: StringHelper.slugify(data.categoryName),
        },
      });

      if (product) {
        const record = this.baseRecord.create({
          name: removeSpecialCharacters(data.name).toLowerCase().trim(),
          type: BaseRecordEnum.PRODUCT,
          parentId: product?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async baseRecordSkeletonForDiscipline() {
    if (await this.checkIfTypeExists(BaseRecordEnum.DISCIPLINE)) return;
    const data = await convertCSVToObject(this.csvFilePath('discipline.csv'));
    data.map(async (data) => {
      const category = await this.baseRecordRepository.findFirstBy({
        name: data.category,
      });
      if (category) {
        const record = this.baseRecord.create({
          uuid: uuidv4(),
          name: removeSpecialCharacters(data.name).toUpperCase().trim(),
          type: BaseRecordEnum.DISCIPLINE,
          parentId: category?.id,
        });
        await this.baseRecord.save(record);
      }
    });
  }

  async seed() {
    await this.baseRecordSkeleton(BaseRecordEnum.NOT_AVAILABLE);
    await this.baseRecordSkeleton(BaseRecordEnum.BUSINESS_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.OPERATOR_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.NCRC_TYPE);
    await this.baseRecordSkeleton(BaseRecordEnum.NCRC_CAPITALIZATION);
    await this.baseRecordSkeleton(BaseRecordEnum.NCRC_PERSONNEL_POSITION);
    await this.baseRecordSkeleton(BaseRecordEnum.NCRC_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.NCEC_OPERATION);

    if (this.configService.get('NODE_ENV') === 'production') return;

    await this.baseRecordSkeleton(BaseRecordEnum.DISCIPLINE);
    await this.baseRecordSkeleton(BaseRecordEnum.CERTIFICATION_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.EDUCATION_LEVEL);
    await this.baseRecordSkeleton(BaseRecordEnum.FACILITY);
    await this.baseRecordSkeleton(BaseRecordEnum.INSTITUTION);
    await this.baseRecordSkeleton(BaseRecordEnum.JOB_FAMILY);
    //await this.baseRecordSkeleton(BaseRecordEnum.JOB_TYPE);
    await this.baseRecordSkeleton(BaseRecordEnum.NATIONALITY);
    await this.baseRecordSkeleton(BaseRecordEnum.NATURE_OF_EMPLOYMENT);
    await this.baseRecordSkeleton(BaseRecordEnum.SERVICE_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.SKILL_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.SKILL_LEVEL);
    await this.baseRecordSkeleton(BaseRecordEnum.STATE);
    await this.baseRecordSkeleton(BaseRecordEnum.COUNTRY);
    await this.baseRecordSkeleton(BaseRecordEnum.MATERIAL_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.MEASUREMENT_UNIT);
    await this.baseRecordSkeleton(BaseRecordEnum.FACILITY_TYPE);
    await this.baseRecordSkeleton(BaseRecordEnum.CURRENCY);
    await this.baseRecordSkeleton(BaseRecordEnum.TENDER_CATEGORY);
    await this.baseRecordSkeleton(BaseRecordEnum.EQUIPMENT_CATEGORY);
    /*await this.baseRecordSkeleton(BaseRecordEnum.NCEC_CAPITALIZATION);
    await this.baseRecordSkeleton(BaseRecordEnum.NCEC_SINGLE_CONTRACT_EXECUTED);
    await this.baseRecordSkeleton(BaseRecordEnum.NCEC_YEARS_OF_INVESTMENT);*/
    await this.baseRecordSkeleton(BaseRecordEnum.MARINE_VESSEL_TYPE);
    await this.baseRecordSkeleton(BaseRecordEnum.TENDER_SERVICE_AREA);
    //await this.baseRecordSkeleton(BaseRecordEnum.DISCIPLINE_CATEGORY);
    await this.baseRecordForProductCategory();
    await this.baseRecordSkeletonForLga();
    await this.baseRecordSkeletonForCourse();
    await this.baseRecordForProductType();
    await this.baseRecordSkeletonForCertificationType();
    await this.baseRecordSkeletonForService();
    await this.baseRecordSkeletonForDiscipline();
    await this.baseRecordSkeletonForDegree();
  }
}
