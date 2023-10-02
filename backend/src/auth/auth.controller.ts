import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { CommonDto } from 'src/common.dto';
import { User } from 'src/users/schemas/user.schema';
import { extractTokenFromHeader } from 'src/_utils/headers';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Req() req: Request, @Body() user: CommonDto<User>) {
    if ('login' in user && 'password' in user)
      return this.authService.signIn(user.login!, user.password!, req.ip);
    else throw new UnauthorizedException();
  }

  @Post('signup')
  signUp(@Req() req: Request, @Body() user: CommonDto<User>) {
    if ('login' in user && 'password' in user)
      return this.authService.signUp(user.login!, user.password!, req.ip);
    else throw new UnauthorizedException();
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const token = extractTokenFromHeader(req);
    return this.authService.findOneByToken(token!);
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    if (!req.headers.authorization) throw new UnauthorizedException();

    const token = extractTokenFromHeader(req);
    const user = await this.authService.findOneByToken(token!);

    if (!user) throw new UnauthorizedException();

    user.token = '';
    user.save();
    return { message: 'logouted' };
  }
}
