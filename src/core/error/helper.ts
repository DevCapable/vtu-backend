import { HttpException } from '@nestjs/common';

export class ExceptionHelper {
  static isOracleDbError(exception: any): boolean {
    return (
      exception.code?.startsWith('ORA-') ||
      OracleErrorRegex.test(exception.message)
    );
  }

  static getOracleDbErrorMessage(exception: any): string {
    const code =
      exception.code || (exception.message.match(/ORA-\d+/) || [])[0];
    return OracleErrorMessages[code] || OracleErrorMessages.default;
  }

  static shouldCaptureExceptionInSentry(exception: Error): boolean {
    if (!(exception instanceof HttpException)) return true;
    const status = exception.getStatus();
    return status >= 500;
  }
}

const OracleErrorMessages: Record<string, string> = {
  'ORA-00001': 'A conflict occurred. Please check your input for duplicates.',
  'ORA-02292':
    'Unable to complete the operation due to related data. Please check your input.',
  'ORA-06512': 'An unexpected error occurred. Please try again later.',
  'ORA-00904':
    'There was an issue processing your request. Please check your input.',
  'ORA-00933':
    'There was an issue processing your request. Please try again later.',
  default: 'An unexpected database error occurred.',
};
const OracleErrorKeywords = [
  'ORA-',
  'PLS-',
  'TNS-',
  'SP2-',
  'EXP-',
  'IMP-',
  'RMAN-',
];
const OracleErrorRegex = new RegExp(`(${OracleErrorKeywords.join('|')})`);
