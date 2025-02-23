import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth.guard';
import {
  LoginDto,
  RegisterDto,
  UpdateUserDto,
} from 'apps/gateway/libs/utils/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register as a user in the system' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Info and Access Token(JWT)',
    schema: {
      example: {
        user: {
          id: '61956512-6eb8-4b2e-bc43-c72d1e506535',
          name: 'kaf',
          email: 'kaf@corpo.com',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia2FmIiwiZW1haWwiOiJrYWZAY29ycG8uY29tIiwicGFzc3dvcmQiOiJwYXNzIiwiaWF0IjoxNzM0Nzk1MjY4LCJleHAiOjE3MzQ3OTcwNjh9.qmgRrvki5UXzMPrIDJsz3owelfO2RdkoV9UyWZ--ar4',
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
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login into the system' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Info and Access Token(JWT)',
    schema: {
      example: {
        user: {
          id: '61956512-6eb8-4b2e-bc43-c72d1e506535',
          name: 'kaf',
          email: 'kaf@corpo.com',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia2FmIiwiZW1haWwiOiJrYWZAY29ycG8uY29tIiwicGFzc3dvcmQiOiJwYXNzIiwiaWF0IjoxNzM0Nzk1MjY4LCJleHAiOjE3MzQ3OTcwNjh9.qmgRrvki5UXzMPrIDJsz3owelfO2RdkoV9UyWZ--ar4',
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
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get your information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Info',
    schema: {
      example: {
        user: {
          id: '61956512-6eb8-4b2e-bc43-c72d1e506535',
          name: 'kaf',
          email: 'kaf@corpo.com',
          created_at: '2024-12-21T11:35:07.041Z',
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
  async getUserInfo(@Req() req) {
    return await this.authService.updateUser({ id: req.user?.id });
  }

  @Put('/users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update your information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Confirmation',
    schema: {
      example: {
        message: 'User information updated successfully!',
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
  async updateUserInfo(@Req() req, @Body() body: UpdateUserDto) {
    return await this.authService.updateUser({ id: req.user?.id, ...body });
  }
}
