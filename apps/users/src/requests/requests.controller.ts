import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { RequestsService } from './requests.service';
import { Equal } from 'typeorm';
import { Status } from '../entities/requests.entity';

@Controller()
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsMicroService: ClientProxy,
  ) {}

  @MessagePattern('process-join-request')
  async sendJoinRequest({
    event_id,
    user_id,
  }: {
    event_id: string;
    user_id: string;
  }) {
    const { eventManager, requester } =
      await this.requestsService.validateJoinRequest({
        event_id,
        user_id,
      });

    if (eventManager) {
      const event = eventManager.events.find((ev) => ev.id === event_id);

      const requestSent = await this.notificationsMicroService
        .send('join-request', {
          email: eventManager.email,
          name: eventManager.name,
          event_title: event.title,
          event_description: event.description,
          requester_email: requester.email,
          requester_name: requester.name,
        })
        .toPromise();

      if (requestSent)
        return await this.requestsService
          .create({ user_id, event_id })
          .then((res) => {
            return { request_status: res.status };
          });
    } else throw new RpcException('Request already sent');
  }

  @MessagePattern('accept-join-request')
  async acceptJoinRequest({
    event_id,
    manager_id,
    request_id,
  }: {
    event_id: string;
    manager_id: string;
    request_id: string;
  }) {
    const request = await this.requestsService.getRequestDetails({
      request_id,
      manager_id,
      event_id,
    });

    const requestSent = await this.notificationsMicroService
      .send('accept-request', {
        email: request.user.email,
        name: request.user.name,
        event_description: request.event.description,
        event_title: request.event.title,
      })
      .toPromise();

    if (requestSent)
      return await this.requestsService
        .update({
          where: { id: Equal(request.id) },
          data: { status: Status.ACCEPTED },
        })
        .then(() => {
          return { message: 'Request Accepted Successfully!' };
        });
  }

  @MessagePattern('reject-join-request')
  async rejectJoinRequest({
    event_id,
    manager_id,
    request_id,
  }: {
    event_id: string;
    manager_id: string;
    request_id: string;
  }) {
    const request = await this.requestsService.getRequestDetails({
      request_id,
      manager_id,
      event_id,
    });

    const requestSent = await this.notificationsMicroService
      .send('reject-request', {
        email: request.user.email,
        name: request.user.name,
        event_title: request.event.title,
      })
      .toPromise();

    if (requestSent)
      return await this.requestsService
        .update({
          where: { id: Equal(request.id) },
          data: { status: Status.REJECTED },
        })
        .then(() => {
          return { message: 'Request Rejected Successfully.' };
        });
  }
}
