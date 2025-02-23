import { Injectable } from '@nestjs/common';
import {
  Equal,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Users } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async validate({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: Equal(email) },
      });

      if (user && user.password === password) return user;
      return null;
    } catch (error) {
      throw new RpcException('Could Not Validate User');
    }
  }

  async register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const user = await this.usersRepository.save(
        this.usersRepository.create({ name, email, password }),
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken: this.generateToken({ user }),
      };
    } catch (error) {
      throw new RpcException('Could Not Register User');
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: {
          email: Equal(email),
          password: Equal(password),
        },
      });

      // ! BCRYPT AND COMPARE PASSWORDS !
      if (password !== user.password)
        throw new Error('Password does not match!');
      // ! BCRYPT AND COMPARE PASSWORDS !

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken: this.generateToken({ user }),
      };
    } catch (error) {
      throw new RpcException('Could Not Login User');
    }
  }

  async updateUser({
    id,
    email,
    name,
  }: {
    id: string;
    email?: string;
    name?: string;
  }) {
    try {
      return await this.usersRepository
        .update({ id: Equal(id) }, { name, email })
        .then((user) => {
          if (user.affected !== 0)
            return { message: 'User Information updated successfully!' };
          else return { message: 'User Information was not updated.' };
        });
    } catch (error) {
      throw new RpcException('Could Not Update User');
    }
  }

  async getUser({
    where,
    select,
    relations,
  }: {
    where?: FindOptionsWhere<Users>;
    select?: FindOptionsSelect<Users>;
    relations?: FindOptionsRelations<Users>;
  }) {
    try {
      return await this.usersRepository.findOneOrFail({
        where,
        select,
        relations,
      });
    } catch (error) {
      throw new RpcException('Could Not Find User');
    }
  }

  private generateToken({ user }: { user: Users }) {
    try {
      return jwt.sign(
        { name: user.name, email: user.email, password: user.password },
        process.env.TOKEN_SECRET || 'tokenSecret',
        {
          expiresIn: '30m',
        },
      );
    } catch (error) {
      throw new RpcException('Could Not Generate Token');
    }
  }
}
