import { AccountTypeEnum } from '@app/account/enums';
import { CreateReview } from '@app/review/interface';
import { ReviewType } from '@app/review/enum/review.enum';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/core/base/base.repository';
import { BaseService } from '@app/core/base/base.service';
import { AppStatus } from '@app/core/enum/app-status.enum';
import { addTrailingZeros, omit } from '@app/core/util';
import { DeepPartial } from 'typeorm';
import { ApplicationHelper } from '@app/core/helpers';
import {
  CustomBadRequestException,
  CustomInternalServerException,
  CustomValidationException,
} from '../error';

@Injectable()
export abstract class BaseApplicationService<
  T extends {
    status?: AppStatus;
    parent?: T;
    child?: T;
    parentId?: number;
    id?: number;
    wfCaseId?: string;
    dateApproved?: Date;
    certificateNumber?: string;
    isDue?: boolean;
    dateDue?: Date;
    dateSubmitted?: Date;
    documentFiles?: any[];
    canRenew?: boolean;
  },
> extends BaseService<T> {
  abstract reviewType: ReviewType;
  dateDueFrequency: number = 2;
  dateDueDuration: string = 'YEAR';
  dateDueSubtractDays = 30;

  protected constructor(private readonly repository: BaseRepository<T>) {
    super(repository);
  }

  _getDateDue(app: T): { dateDue: Date; isDue: boolean; canRenew: boolean } {
    const helper = this.applicationHelper(app);

    const dateDue = helper.getExpiryDate();

    const { isDue, canRenew } = helper.getExpiryStatus();

    return { dateDue, isDue, canRenew };
  }

  async findAll(
    filterOptions: {
      sortKey?: string;
      sortDir?: 'ASC' | 'DESC';
      [key: string]: any;
    } = {},
    paginationOptions: { skip?: number; limit?: number } = {},
    relations: string[] = [],
  ): Promise<{ data: T[]; totalCount: number }> {
    const [data, totalCount] = await this.repository.findAll(
      filterOptions,
      paginationOptions,
      relations,
    );

    const mappedData = await Promise.all(
      data.map(async (app) => {
        return this._loadWithAdditionalData(app);
      }),
    );

    return { data: mappedData, totalCount };
  }

  async createReview(reviewPayload: CreateReview): Promise<CreateReview> {
    const { reviewer } = reviewPayload;
    const isAgency = reviewer.account.type === AccountTypeEnum.AGENCY;

    if (isAgency) {
      return await this._createReviewForAgency(reviewPayload);
    }

    return await this._createReviewForCompany(reviewPayload);
  }

  protected abstract _createReviewForAgency(
    reviewPayload: CreateReview,
  ): Promise<CreateReview>;

  protected abstract _createReviewForCompany(
    reviewPayload: CreateReview,
  ): Promise<CreateReview>;

  async updateReview(id: any, data: any): Promise<T> {
    const { status, wfCaseId } = data;
    // if the application is approved and the id is present
    if (!wfCaseId)
      throw new CustomValidationException({ type: 'wfCaseId is required' });

    if (status === AppStatus.PENDING) {
      data.dateSubmitted = new Date();
    }

    if (status === AppStatus.APPROVED) {
      const app = await this.repository.findFirst({ wfCaseId });

      if (app?.status === AppStatus.APPROVED) {
        throw new CustomInternalServerException(
          'Application approved cannot be updated',
        );
      }

      data.certificateNumber = await this._generateCertificateNumber(app);
      data.dateApproved = new Date();
    }

    return this.repository.update(id, data);
  }

  async createRenewal(app: DeepPartial<T>): Promise<T> {
    const newEntity = this._prepareRenewal(app);
    const newApp = await this.create(newEntity as T);

    return this.findOne(newApp.id);
  }

  async update(id, entity: DeepPartial<T>): Promise<T> {
    const app = await this.findOne(id);
    const { status, canRenew } = app;

    if ([AppStatus.APPROVED].includes(status) && !canRenew) {
      throw new CustomInternalServerException('Application cannot be updated');
    }

    if (status === AppStatus.EXPIRED || canRenew) {
      if (app.child) {
        throw new CustomBadRequestException('Application already renewed');
      }

      return this.createRenewal(entity);
    }

    return this.repository.update(id, entity);
  }

  async findOne(id: number): Promise<T> {
    // TODO - remove queries for parent and child on applications with request i.e. expatriate quota
    const app = await this.repository.findById(id);
    return await this._loadWithAdditionalData(app);
  }

  async _loadWithAdditionalData(app: T): Promise<T> {
    if (!app) return app;

    const helper = this.applicationHelper(app);

    return await helper.transformData(this.repository);
  }

  async _generateCertificateNumber(entity: T): Promise<string> {
    if (!entity.wfCaseId) return null;

    const total = await this.repository.count({ status: AppStatus.APPROVED });

    return `NCDMB-${this.reviewType}-${addTrailingZeros(total + 1, 4)}`;
  }

  protected _prepareRenewal(app: DeepPartial<T>) {
    const { id, ...entityOthers } = app;

    const newEntity = omit(entityOthers, [
      'certificateNumber',
      'dateApproved',
      'dateSubmitted',
      'createdAt',
      'updatedAt',
      'status',
      'appNumber',
      'wfCaseId',
      'parentId',
    ]);

    return {
      ...newEntity,
      parentId: id,
    };
  }

  async validateCreateDocumentFile(entityId: number) {
    const entity = await this.findOne(entityId);

    if (
      ![AppStatus.NOT_SUBMITTED, AppStatus.REJECTED].includes(entity.status)
    ) {
      throw new CustomBadRequestException(
        'Only applications not submitted or rejected can be updated',
      );
    }
  }

  private applicationHelper(app: T): ApplicationHelper<T> {
    const { frequency, duration, subtractDays } = this.getDateDueOptions(app);

    return new ApplicationHelper(app, {
      frequency,
      duration,
      subtractDays,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDateDueOptions(app: T): {
    frequency: number;
    duration: string;
    subtractDays: number;
  } {
    return {
      frequency: this.dateDueFrequency,
      duration: this.dateDueDuration,
      subtractDays: this.dateDueSubtractDays,
    };
  }
}
