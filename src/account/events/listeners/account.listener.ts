import { eventType } from '@app/core/event-type';
import { MailService } from '@app/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AccountListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(eventType.INDIVIDUAL_WELCOME)
  async individualWelcomeListener(payload) {
    this.mailService.send(payload, eventType.INDIVIDUAL_WELCOME);
  }

  @OnEvent(eventType.INDIVIDUAL_ACTIVATION)
  async individualActivationListener(payload) {
    this.mailService.send(payload, eventType.INDIVIDUAL_ACTIVATION);
  }

  @OnEvent(eventType.COMPANY_WELCOME)
  async companyWelcomeListener(payload) {
    this.mailService.send(payload, eventType.COMPANY_WELCOME);
  }

  @OnEvent(eventType.OPERATOR_WELCOME)
  async operatorWelcomeListener(payload) {
    this.mailService.send(payload, eventType.OPERATOR_WELCOME);
  }

  @OnEvent(eventType.AGENCY_WELCOME)
  async agencyWelcomeListener(payload) {
    this.mailService.send(payload, eventType.AGENCY_WELCOME);
  }
}
