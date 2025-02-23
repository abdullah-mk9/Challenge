import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserDto } from '../libs/utils/dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET || 'tokenSecret',
    });
  }

  async validate(
    payload: Partial<UserDto>,
  ): Promise<{ id: string; name: string; email: string }> {
    const user = await this.authService.validateUser({
      email: payload.email,
      password: payload.password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
