import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from '../entities/events.entity';
import { Equal, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Categories } from '../entities/categories.entity';
import { UsersService } from '../users/users.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private readonly usersService: UsersService,
  ) {}

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
  }): Promise<{
    events: Events[];
    total: number;
    pages: { total: number; current: number };
  }> {
    try {
      let where: FindOptionsWhere<Events> = {};

      if (category?.name)
        where.category = { name: ILike(`%${category.name}%`) };
      if (category?.type)
        where.category = { type: ILike(`%${category.type}%`) };

      if (date) where.date = Equal(date);

      const [events, total] = await this.eventsRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        relations: { category: true },
      });

      return {
        events,
        total,
        pages: { current: page, total: Math.ceil(total / limit) },
      };
    } catch (error) {
      throw new RpcException('Could not list events');
    }
  }

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
  }): Promise<Events> {
    try {
      const _category = await this.findOrCreateCategory(category);

      const user = await this.usersService.getUser({
        where: { id: Equal(user_id) },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return await this.eventsRepository.save(
        this.eventsRepository.create({
          title,
          category: _category,
          description,
          date,
          user,
        }),
      );
    } catch (error) {
      throw new RpcException('Could not create event.');
    }
  }

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
    try {
      const _category = await this.findOrCreateCategory(category);

      return await this.eventsRepository
        .update(
          {
            id: Equal(event_id),
            user: { id: Equal(id) },
          },
          { title, category: _category, description, date },
        )
        .then((user) => {
          if (user.affected !== 0)
            return { message: 'Event Information updated successfully!' };
          else return { message: 'Event Information was not updated.' };
        });
    } catch (error) {
      throw new RpcException('Could not update event.');
    }
  }

  async findOrCreateCategory({
    name,
    type,
  }: {
    name: string;
    type?: string;
  }): Promise<Categories> {
    try {
      let where: FindOptionsWhere<Categories> = { name: Equal(name) };

      if (type) where.type = Equal(type);

      let _category = await this.categoriesRepository.findOne({
        where,
      });

      if (_category) return _category;

      return await this.categoriesRepository.save(
        this.categoriesRepository.create({ name, ...(type ? { type } : {}) }),
      );
    } catch (error) {
      throw new RpcException('Could not find or create category.');
    }
  }
}
