import dayjs from 'dayjs';

export class DateHelper {
  private static durationUnits: { [key: string]: dayjs.ManipulateType } = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
  };

  static getExpiryDate(
    date: string | Date,
    frequency = 1,
    duration = 'YEAR',
  ): Date {
    const currentDate = dayjs(date);
    const unit = this.durationUnits[duration.toUpperCase()] || 'year';
    return currentDate.add(frequency, unit).subtract(1, 'day').toDate();
  }

  static getExpiryStatus(
    dateDue: Date | null,
    subtractDays = 30,
  ): { isDue: boolean; canRenew: boolean } {
    if (!dateDue) return { isDue: false, canRenew: false };

    const now = dayjs();
    const expiry = dayjs(dateDue);
    const isDue = now.isAfter(expiry) || now.isSame(expiry);

    const renewalDate = expiry.subtract(subtractDays, 'day');
    const canRenew =
      (now.isAfter(renewalDate) || now.isSame(renewalDate)) &&
      now.isBefore(dateDue);

    return { isDue, canRenew };
  }
}
