import { eventType } from '@app/core/event-type';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccountEvent {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async individualWelcome(payload) {
    this.eventEmitter.emit(eventType.INDIVIDUAL_WELCOME, {
      to: payload.user.email,
      subject: 'Welcome to the NOGIC JQS',
      context: {
        name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
      },
    });
  }

  async individualActivation(payload) {
    this.eventEmitter.emit(eventType.INDIVIDUAL_ACTIVATION, {
      to: payload.user.email,
      subject: 'Activation of Account',
      context: {
        url: `${process.env.MAIL_FRONTEND_URL}/auth/verify/${payload.token}`,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        email: payload.user.email,
        password: payload.user._raw,
      },
    });
  }

  async companyWelcome(payload) {
    this.eventEmitter.emit(eventType.COMPANY_WELCOME, {
      to: payload.user.email,
      subject: 'Welcome to the NOGIC JQS',
      context: {
        email: payload.user.email,
        password: payload.user._raw,
        orgName: payload.user.firstName,
      },
    });
  }

  async operatorWelcome(payload) {
    this.eventEmitter.emit(eventType.OPERATOR_WELCOME, {
      to: payload.user.email,
      subject: 'Welcome to the NOGIC JQS',
      context: {
        email: payload.user.email,
        password: payload.user._raw,
        orgName: payload.user.firstName,
      },
    });
  }

  async agencyWelcome(payload) {
    this.eventEmitter.emit(eventType.AGENCY_WELCOME, {
      to: payload.user.email,
      subject: 'Welcome to the NOGIC JQS',
      context: {
        email: payload.user.email,
        password: payload.user._raw,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
      },
    });
  }
}
