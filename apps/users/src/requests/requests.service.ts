import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, Not, Repository } from 'typeorm';
import { Requests, Status } from '../entities/requests.entity';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    private readonly usersService: UsersService,
  ) {}

  async validateJoinRequest({
    event_id,
    user_id,
  }: {
    event_id: string;
    user_id: string;
  }) {
    try {
      const request = await this.requestsRepository.findOne({
        where: {
          event: { id: Equal(event_id) },
          user: { id: Equal(user_id) },
        },
      });

      if (request) return null;

      const eventManager = await this.usersService.getUser({
        where: { events: { id: Equal(event_id) } },
        relations: { events: true },
      });

      const requester = await this.usersService.getUser({
        where: { id: Equal(user_id) },
      });

      return { eventManager, requester };
    } catch (error) {
      throw new RpcException('Could not send join request');
    }
  }

  async getRequestDetails({
    event_id,
    manager_id,
    request_id,
  }: {
    event_id: string;
    manager_id: string;
    request_id: string;
  }) {
    try {
      return await this.requestsRepository.findOneOrFail({
        where: {
          id: Equal(request_id),
          event: {
            id: Equal(event_id),
            user: { id: Equal(manager_id) },
          },
          status: Status.PENDING,
        },
        relations: { event: true, user: true },
      });
    } catch (error) {
      throw new RpcException('Could not find request');
    }
  }

  async create({ event_id, user_id }: { event_id: string; user_id: string }) {
    try {
      return await this.requestsRepository.save(
        this.requestsRepository.create({
          event: { id: event_id },
          user: { id: user_id },
        }),
      );
    } catch (error) {
      throw new RpcException('Could not send join request');
    }
  }

  async update({
    where,
    data,
  }: {
    where: FindOptionsWhere<Requests>;
    data: Partial<Requests>;
  }) {
    try {
      return await this.requestsRepository.update(where, data);
    } catch (error) {
      throw new RpcException('Could not update request.');
    }
  }
}
