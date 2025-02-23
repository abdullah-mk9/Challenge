import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { Equal } from 'typeorm';
import { LoginDto, RegisterDto } from 'apps/gateway/libs/utils/dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('validate')
  async validate(body: RegisterDto) {
    return await this.usersService.validate({
      email: body.email,
      password: body.password, // ! Should be encrypted.
    });
  }

  @MessagePattern('register')
  async register(body: RegisterDto) {
    return await this.usersService.register({
      name: body.name,
      email: body.email,
      password: body.password, // ! Should be encrypted.
    });
  }

  @MessagePattern('login')
  async login(body: LoginDto) {
    return await this.usersService.login({
      email: body.email,
      password: body.password, // ! Should be encrypted.
    });
  }

  @MessagePattern('get-user')
  async getUserInfo({ id }: { id: string }) {
    return await this.usersService.getUser({
      where: { id: Equal(id) },
      select: { id: true, email: true, name: true, created_at: true },
    });
  }

  @MessagePattern('update')
  async updateUserInfo({
    id,
    email,
    name,
  }: {
    id: string;
    email?: string;
    name?: string;
  }) {
    return await this.usersService.updateUser({ id, email, name });
  }
}
