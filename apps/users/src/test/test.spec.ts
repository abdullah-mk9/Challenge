import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Events } from '../entities/events.entity';
import { Categories } from '../entities/categories.entity';
import { UsersService } from '../users/users.service';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { EventsService } from '../events/events.service';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: Repository<Events>;
  let categoriesRepository: Repository<Categories>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Events),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Categories),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Repository<Events>>(
      getRepositoryToken(Events),
    );
    categoriesRepository = module.get<Repository<Categories>>(
      getRepositoryToken(Categories),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listEvents', () => {
    it('should list events with pagination', async () => {
      const mockEvents: Events[] = [
        {
          id: uuidv4(),
          title: 'Test Event',
          description: 'Test Description',
          date: new Date(),
          category: {
            id: uuidv4(),
            name: 'Test Category',
            type: 'tech',
            events: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          user: {
            id: uuidv4(),
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
            events: [],
            requests: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          requests: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      const total = 1;

      jest
        .spyOn(eventsRepository, 'findAndCount')
        .mockResolvedValue([mockEvents, total]);

      const result = await service.listEvents({ page: 1, limit: 10 });

      expect(result).toEqual({
        events: mockEvents,
        total,
        pages: { current: 1, total: 1 },
      });
      expect(eventsRepository.findAndCount).toHaveBeenCalled();
    });

    it('should throw an exception on error', async () => {
      jest
        .spyOn(eventsRepository, 'findAndCount')
        .mockRejectedValue(new Error());

      await expect(service.listEvents({ page: 1, limit: 10 })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const mockCategory: Categories = {
        id: uuidv4(),
        name: 'Test Category',
        type: 'tech',
        events: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockUser = {
        id: uuidv4(),
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        events: [],
        requests: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockEvent: Events = {
        id: uuidv4(),
        title: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        category: mockCategory,
        user: mockUser,
        requests: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(service as any, 'findOrCreateCategory')
        .mockResolvedValue(mockCategory);
      jest.spyOn(usersService, 'getUser').mockResolvedValue(mockUser);
      jest.spyOn(eventsRepository, 'save').mockResolvedValue(mockEvent);

      const result = await service.createEvent({
        user_id: mockUser.id,
        title: 'Test Event',
        description: 'Test Description',
        category: { name: 'Test Category' },
        date: new Date(),
      });

      expect(result).toEqual(mockEvent);
      expect(service.findOrCreateCategory).toHaveBeenCalledWith({
        name: 'Test Category',
      });
      expect(usersService.getUser).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(eventsRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const mockCategory: Categories = {
        id: uuidv4(),
        name: 'Updated Category',
        type: 'tech',
        events: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest
        .spyOn(service as any, 'findOrCreateCategory')
        .mockResolvedValue(mockCategory);

      jest
        .spyOn(eventsRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateEvent({
        id: uuidv4(),
        event_id: uuidv4(),
        title: 'Updated Title',
        description: 'Updated Description',
        category: { name: 'Updated Category' },
        date: new Date(),
      });

      expect(result).toEqual({
        message: 'Event Information updated successfully!',
      });
      expect(eventsRepository.update).toHaveBeenCalled();
    });

    it('should return a message if no rows are affected', async () => {
      jest
        .spyOn(eventsRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      const result = await service.updateEvent({
        id: uuidv4(),
        event_id: uuidv4(),
        title: 'Updated Title',
      });

      expect(result).toEqual({ message: 'Event Information was not updated.' });
    });

    it('should throw an exception on error', async () => {
      jest.spyOn(eventsRepository, 'update').mockRejectedValue(new Error());

      await expect(
        service.updateEvent({
          id: uuidv4(),
          event_id: uuidv4(),
          title: 'Updated Title',
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('findOrCreateCategory', () => {
    it('should find an existing category', async () => {
      const mockCategory: Categories = {
        id: uuidv4(),
        name: 'Test Category',
        type: 'tech',
        events: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(categoriesRepository, 'findOne')
        .mockResolvedValue(mockCategory);

      const result = await service['findOrCreateCategory']({
        name: 'Test Category',
      });

      expect(result).toEqual(mockCategory);
      expect(categoriesRepository.findOne).toHaveBeenCalled();
    });

    it('should create a new category if none exists', async () => {
      const mockCategory: Categories = {
        id: uuidv4(),
        name: 'New Category',
        type: 'tech',
        events: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(categoriesRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(categoriesRepository, 'save').mockResolvedValue(mockCategory);

      const result = await service['findOrCreateCategory']({
        name: 'New Category',
      });

      expect(result).toEqual(mockCategory);
      expect(categoriesRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception on error', async () => {
      jest
        .spyOn(categoriesRepository, 'findOne')
        .mockRejectedValue(new Error());

      await expect(
        service['findOrCreateCategory']({ name: 'Test Category' }),
      ).rejects.toThrow(RpcException);
    });
  });
});
