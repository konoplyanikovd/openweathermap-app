import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string, ip: string) {
    const user = await this.usersService.findOneByLogin(login);

    if (user?.password !== pass) throw new UnauthorizedException();

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
      login: user.login,
    });

    user.token = accessToken;
    user.ip = ip;
    user.firstRequest = '';
    user.countRequest = 0;
    user.save();

    return {
      access_token: accessToken,
    };
  }

  async signUp(login: string, password: string, ip: string) {
    const user = await this.usersService.create({ login, password, ip });

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
      login: user.login,
    });

    user.token = accessToken;
    user.ip = ip;
    user.save();

    return {
      access_token: accessToken,
    };
  }

  findOneByToken(token: string) {
    return this.usersService.findOneByToken(token);
  }
}
