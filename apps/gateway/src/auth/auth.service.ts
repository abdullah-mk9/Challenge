import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from 'apps/gateway/libs/utils/dto';

@Injectable()
export class AuthService {
  constructor(
    // @Inject('NOTIFICATIONS_SERVICE')
    // private readonly notificationsProxy: ClientProxy,
    @Inject('USERS_SERVICE')
    private readonly usersMicroService: ClientProxy,
  ) {}

  async validateUser(data: { email: string; password: string }) {
    try {
      return await this.usersMicroService.send('validate', data).toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could not Validate!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(data: RegisterDto) {
    try {
      return await this.usersMicroService.send('register', data).toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could Not Register User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(data: LoginDto) {
    try {
      return await this.usersMicroService.send('login', data).toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could Not Login User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser({ id }: { id: string }) {
    try {
      return await this.usersMicroService.send('get-user', { id }).toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could Not Get User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser({
    id,
    name,
    email,
  }: {
    id: string;
    name?: string;
    email?: string;
  }) {
    try {
      return await this.usersMicroService
        .send('update', { id, name, email })
        .toPromise();
    } catch (error) {
      throw new HttpException(
        error.message || 'Could Not Update User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
