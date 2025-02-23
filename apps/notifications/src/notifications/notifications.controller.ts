import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('join-request')
  async joinRequest({
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
    return await this.notificationsService.sendJoinRequest({
      email,
      name,
      event_title,
      event_description,
      requester_email,
      requester_name,
    });
  }

  @MessagePattern('accept-request')
  async acceptJoinRequest({
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
    return await this.notificationsService.sendAcceptRequest({
      email,
      name,
      event_title,
      event_description,
    });
  }

  @MessagePattern('reject-request')
  async rejectJoinRequest({
    email,
    name,
    event_title,
  }: {
    email: string;
    name: string;
    event_title: string;
  }) {
    return await this.notificationsService.sendRejectRequest({
      email,
      name,
      event_title,
    });
  }
}
