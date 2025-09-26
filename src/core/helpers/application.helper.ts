import { DateHelper } from './date.helper';
import { BaseRepository } from '@app/core/base/base.repository';
import { AppStatus } from '@app/core/enum/app-status.enum';

interface DateOptions {
  frequency?: number;
  duration?: string;
  subtractDays?: number;
}

interface ExpiryStatus {
  expiryDate: Date | null;
  isDue: boolean;
  canRenew: boolean;
}

interface DefaultApp {
  dateApproved?: string | Date;
  parentId?: number;
  id?: number;
  status?: AppStatus;
}

export class ApplicationHelper<T extends DefaultApp = DefaultApp> {
  static readonly DEFAULT_DATE_OPTIONS: DateOptions = {
    frequency: 2,
    duration: 'YEAR',
    subtractDays: 30,
  };

  private readonly app: T;
  private readonly dateOptions: DateOptions;
  private expiryDate: Date | null = null;

  constructor(app: T, dateOptions: DateOptions = {}) {
    this.app = app;
    this.dateOptions = {
      ...ApplicationHelper.DEFAULT_DATE_OPTIONS,
      ...dateOptions,
    };
  }

  getExpiryDate(): Date | null {
    return (this.expiryDate ??= this.calculateExpiryDate());
  }

  getExpiryStatus(): ExpiryStatus {
    const expiryDate = this.getExpiryDate();

    const { isDue, canRenew } = DateHelper.getExpiryStatus(
      expiryDate,
      this.dateOptions.subtractDays,
    );

    return { expiryDate, isDue, canRenew };
  }

  async transformData(repository: BaseRepository<T>): Promise<T> {
    let parent = null;

    if (!this.app) return this.app;

    if (this.app.parentId) {
      parent = await repository.findFirst({
        id: this.app.parentId,
      });
    }

    const child = await repository.findFirst({
      parentId: this.app.id,
    });

    const { expiryDate, isDue, canRenew } = this.getExpiryStatus();

    const status = isDue ? AppStatus.EXPIRED : this.app.status;

    return {
      ...this.app,
      parent,
      child,
      dateDue: expiryDate,
      isDue,
      status,
      canRenew,
    };
  }

  private calculateExpiryDate(): Date | null {
    const date = this.app?.dateApproved;

    if (!date) return null;

    const { frequency, duration } = this.dateOptions;
    return DateHelper.getExpiryDate(date, frequency, duration);
  }
}
