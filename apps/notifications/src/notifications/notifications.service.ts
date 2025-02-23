import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { joinRequest } from '../templates/join-request';
import { acceptedEmail } from '../templates/accept';
import { rejectedEmail } from '../templates/reject';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendJoinRequest({
    email,
    name,
    event_title,
    event_description,
    requester_email,
    requester_name,
  }: {
    email: string;
    name: string;
    event_title: string;
    event_description: string;
    requester_email: string;
    requester_name: string;
  }) {
    try {
      return await this.sendEmail(
        email,
        'New Join Request for Your Event',
        joinRequest({
          name,
          eventDescription: event_description,
          eventName: event_title,
          requesterEmail: requester_email,
          requesterName: requester_name,
        }),
      ).then(() => true);
    } catch (error) {
      throw new RpcException('Could not send Join Request Email.');
    }
  }

  async sendAcceptRequest({
    email,
    name,
    event_title,
    event_description,
  }: {
    email: string;
    name: string;
    event_title: string;
    event_description: string;
  }) {
    try {
      return await this.sendEmail(
        email,
        event_title + ' Request Accepted',
        acceptedEmail({
          name,
          eventDescription: event_description,
          eventName: event_title,
        }),
      ).then(() => true);
    } catch (error) {
      throw new RpcException('Could not send Accept Request Email.');
    }
  }

  async sendRejectRequest({
    email,
    name,
    event_title,
  }: {
    email: string;
    name: string;
    event_title: string;
  }) {
    try {
      return await this.sendEmail(
        email,
        event_title + ' Request Rejected',
        rejectedEmail({
          name,
          eventName: event_title,
        }),
      ).then(() => true);
    } catch (error) {
      throw new RpcException('Could not send Reject Request Email.');
    }
  }

  private async sendEmail(to: string, subject: string, template: string) {
    return this.mailerService.sendMail({
      to,
      subject,
      html: template,
    });
  }
}
