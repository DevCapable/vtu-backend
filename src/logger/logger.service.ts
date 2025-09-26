import { BaseService } from '@app/core/base/base.service';
import { CurrentUserData } from '@app/iam/interfaces';
import { LoggerService as NestLoggerService, Injectable } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.splat(),
        format.json(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'error',
          format: format.combine(
            format.printf(({ level, message, timestamp }) => {
              let user: CurrentUserData | null;
              try {
                user = BaseService.getCurrentUser();
              } catch (e) {}
              if (user) {
                const { email, account, id } = user;
                return `${timestamp} [${level}]${user ? ` [USER: ${account?.type} - ${id} - ${email}]:` : ''} ${message}`;
              } else return `${timestamp} [${level}]: ${message}`;
            }),
          ),
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
        }),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(`[${context || 'App'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(`[${context || 'App'}] ${message}`, { trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(`[${context || 'App'}] ${message}`);
  }

  debug?(message: string, context?: string): void {
    this.logger.debug(`[${context || 'App'}] ${message}`);
  }

  verbose?(message: string, context?: string): void {
    this.logger.verbose(`[${context || 'App'}] ${message}`);
  }
}
