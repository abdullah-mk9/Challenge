import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern('list-events')
  async listEvents({
    page = 1,
    limit = 30,
    category,
    date,
  }: {
    page?: number;
    limit?: number;
    date?: Date;
    category?: { name: string; type?: string };
  }) {
    return await this.eventsService.listEvents({
      page,
      limit,
      date,
      category,
    });
  }

  @MessagePattern('create-event')
  async createEvent({
    user_id,
    title,
    description,
    category,
    date,
  }: {
    user_id: string;
    title: string;
    category: { name: string; type?: string };
    description: string;
    date: Date;
  }) {
    return await this.eventsService.createEvent({
      user_id,
      title,
      description,
      category,
      date,
    });
  }

  @MessagePattern('update-event')
  async updateEvent({
    id,
    event_id,
    title,
    description,
    category,
    date,
  }: {
    id: string;
    event_id: string;
    title?: string;
    category?: { name: string; type?: string };
    description?: string;
    date?: Date;
  }) {
    return await this.eventsService.updateEvent({
      id,
      event_id,
      title,
      description,
      category,
      date,
    });
  }
}
