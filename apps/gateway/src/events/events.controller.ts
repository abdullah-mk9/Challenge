import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto } from 'apps/gateway/libs/utils/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller({ path: 'events' })
export class EventsController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersProxy: ClientProxy,
  ) {}

  // ** Public **
  @Get()
  @ApiOperation({ summary: 'Public Endpoint for listing Events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all events in the system',
    schema: {
      example: {
        events: [
          {
            id: 'c62dcb64-7b45-47e1-bb2f-52ff80177984',
            title: 'event1',
            description: 'Event desc',
            date: '2024-12-31T21:00:00.000Z',
            created_at: '2024-12-20T13:21:46.455Z',
            updated_at: '2024-12-20T13:21:46.455Z',
            category: {
              id: 'cc763cb8-479b-4a01-b220-241484106031',
              name: 'Tech',
              type: 'tech',
              created_at: '2024-12-20T13:20:58.944Z',
              updated_at: '2024-12-20T13:20:58.944Z',
            },
          },
          {
            id: '422d7c7c-c483-4a73-aac7-23d36f974964',
            title: 'BRUH 2',
            description: 'Event description',
            date: '2025-01-01T21:00:00.000Z',
            created_at: '2024-12-20T17:23:39.691Z',
            updated_at: '2024-12-20T17:36:06.349Z',
            category: {
              id: '25f530d3-ae9f-48b7-bd46-c44d08741677',
              name: 'Tech',
              type: 'Tech',
              created_at: '2024-12-20T17:23:39.593Z',
              updated_at: '2024-12-20T17:23:39.593Z',
            },
          },
        ],
        total: 2,
        pages: {
          current: 1,
          total: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async listEvents(
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('limit', new DefaultValuePipe(30)) limit?: number,
    @Query('date') date?: Date,
    @Query('category') category?: { name?: string; type?: string },
  ) {
    try {
      return await this.usersProxy
        .send('list-events', { page, limit, date, category })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not list events.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an event.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event details',
    schema: {
      example: {
        id: '77fa5535-fac6-40d1-9d21-60925e4f83f3',
        title: 'Event 2',
        description: 'Event description',
        date: '2025-01-01T21:00:00.000Z',
        category: {
          id: '25f530d3-ae9f-48b7-bd46-c44d08741677',
          name: 'Tech',
          type: 'Tech',
          created_at: '2024-12-20T17:23:39.593Z',
          updated_at: '2024-12-20T17:23:39.593Z',
        },
        user: {
          id: '61956512-6eb8-4b2e-bc43-c72d1e506535',
          name: 'kaf',
          email: 'kafiniabdullah@gmail.com',
        },
        created_at: '2024-12-21T16:38:46.456Z',
        updated_at: '2024-12-21T16:38:46.456Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async createEvent(@Req() req, @Body() body: CreateEventDto) {
    try {
      return await this.usersProxy
        .send('create-event', { user_id: req.user?.id, ...body })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not create event.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/:id/join')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a request to join an event.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Request Status',
    schema: {
      example: {
        request_status: 'pending',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async sendJoinRequest(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.usersProxy
        .send('process-join-request', { event_id: id, user_id: req.user?.id })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not send join request.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/requests/:request_id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Accept join request.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request Status',
    schema: {
      example: {
        message: 'Request Accepted Successfully!',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async acceptJoinRequest(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('request_id', ParseUUIDPipe) request_id: string,
  ) {
    try {
      return await this.usersProxy
        .send('accept-join-request', {
          event_id: id,
          manager_id: req.user?.id,
          request_id,
        })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not accept join request.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/requests/:request_id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reject join request.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request Status',
    schema: {
      example: {
        message: 'Request Rejected Successfully!',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async rejectJoinRequest(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('request_id', ParseUUIDPipe) request_id: string,
  ) {
    try {
      return await this.usersProxy
        .send('reject-join-request', {
          event_id: id,
          manager_id: req.user?.id,
          request_id,
        })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not reject join request.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Event Details.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Confirmation',
    schema: {
      example: {
        message: 'Event Information updated successfully!',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal error from the system',
  })
  async updateEvent(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDto,
  ) {
    try {
      return await this.usersProxy
        .send('update-event', { user_id: req.user?.id, id, ...body })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not update event.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
