import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from './entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { RequestsController } from './requests/requests.controller';
import { RequestsService } from './requests/requests.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // I SHOULD USE ENV
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'kaf',
        password: 'kaf123',
        database: 'challenge',
        entities,
        synchronize: true,
        // migrations: [__dirname + '/../migrations/*.ts'],
        // cli: {
        //   migrationsDir: 'src/migrations',
        // },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [UsersController, EventsController, RequestsController],
  providers: [UsersService, EventsService, RequestsService],
})
export class UsersModule {}
