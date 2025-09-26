import { CustomBadRequestException } from './custom-errors';

export class PasswordMigrationException extends CustomBadRequestException {
  constructor(userEmail: string) {
    super(Message, 'ERR_PASSWORD_MIGRATION_REQUIRED', {
      resetPasswordUrl: `/auth/forgot-password?email=${encodeURIComponent(userEmail)}`,
    });
  }
}

const Message = `We have recently upgraded our system for enhanced security and performance.
  As part of this process, your old password is no longer valid.
  Please reset your password using the 'Forgot Password' link below. For more
  details, check your email for instructions on how to reset your password.
  If you need further assistance, contact our support team.`;
