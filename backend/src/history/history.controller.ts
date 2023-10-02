import { Controller, Get, Param, Delete, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from './schemas/history.schema';
import { extractTokenFromHeader } from 'src/_utils/headers';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import mongoose from 'mongoose';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get('by-user')
  async findAllByUser(@Req() req: Request) {
    let user: UserDocument | null = null;
    if (!req.headers.authorization) {
      user =
        (await this.userService.findOneByApi(req.ip)) ??
        (await this.userService.create({ ip: req.ip }));
    } else {
      const token = extractTokenFromHeader(req);
      user = await this.userService.findOneByToken(token!);
    }
    return (await this.historyService.findBy('owner', user!._id)) ?? [];
  }

  @Get(':key,:value')
  findBy(@Param('key') key: keyof History, @Param('value') value: string) {
    return this.historyService.findBy(key, value);
  }

  @Delete(':key,:value')
  clearBy(
    @Param('key') key: keyof History,
    @Param('value') value: string | mongoose.Types.ObjectId,
  ) {
    return this.historyService.clearBy(key, value);
  }

  @Delete('by-user/clear')
  async clearByUser(@Req() req: Request) {
    let user: UserDocument | null = null;
    if (!req.headers.authorization) {
      user =
        (await this.userService.findOneByApi(req.ip)) ??
        (await this.userService.create({ ip: req.ip }));
    } else {
      const token = extractTokenFromHeader(req);
      user = await this.userService.findOneByToken(token!);
    }
    await this.clearBy('owner', user!._id);
  }
}
