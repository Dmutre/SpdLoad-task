import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOptionsDTO } from '../dtos/MailOprionsDTO';
import { resolve } from 'path';

@Injectable()
export class MailService {
  constructor (
    private mailer: MailerService,
  ) {}

  async send ({ to, subject, message, link }: MailOptionsDTO): Promise<void> {
    await this.mailer.sendMail({
      to,
      subject,
      template: resolve('./mail/templates/template.hbs'),
      context: { message, link },
    });
  }
}