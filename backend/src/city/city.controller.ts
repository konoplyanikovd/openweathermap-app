import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CityService } from './city.service';
import { HistoryService } from 'src/history/history.service';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { extractTokenFromHeader } from 'src/_utils/headers';

@Controller('city')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    private readonly historyService: HistoryService,
    private readonly userService: UsersService,
  ) {}

  @Get('favourites')
  async findAllFavourites(@Req() req: Request) {
    let user: UserDocument | null = null;
    if (!req.headers.authorization) {
      user =
        (await this.userService.findOneByApi(req.ip)) ??
        (await this.userService.create({ ip: req.ip }));
    } else {
      const token = extractTokenFromHeader(req);
      user = await this.userService.findOneByToken(token!);
    }
    return (await this.cityService.findBy('owner', user!._id)) ?? [];
  }

  @Get(':name')
  async findOne(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('name') name: string,
  ) {
    try {
      let user: UserDocument | null = null;

      if (!req.headers.authorization) {
        user =
          (await this.userService.findOneByApi(req.ip)) ??
          (await this.userService.create({ ip: req.ip }));

        const dateTimeDiff =
          new Date().getTime() -
          new Date(Number.parseInt(user.firstRequest)).getTime();
        const dateTimeDiffAbs = Math.abs(dateTimeDiff) / (1000 * 60);
        const timeDiff = Math.ceil(dateTimeDiffAbs);

        if ((user.countRequest ?? 1) >= 14) {
          if (timeDiff <= 60) {
            throw new BadRequestException(
              'Requests are limit over, login, please',
            );
          } else {
            user.countRequest = 1;
            user.firstRequest = String(Date.now());
          }
        } else {
          user.countRequest += 1;
          if (user.countRequest === 1) user.firstRequest = String(Date.now());
        }
        user.save();
      } else {
        const token = extractTokenFromHeader(req);
        user = await this.userService.findOneByToken(token!);
      }

      await this.historyService.create({
        value: name,
        owner: user!._id,
      });
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&lang=ru&appid=`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!forecastResponse || forecastResponse.status !== HttpStatus.OK) {
        res.status(forecastResponse.status);
        return 'Forecast api has problem';
      }

      const forecastBody = await (forecastResponse.headers
        .get('Content-Type')
        ?.includes('json')
        ? forecastResponse.json()
        : forecastResponse.text());

      const innerCity = await this.findOrCreateCity(name, user!);
      if (innerCity) {
        Object.assign(forecastBody.city, {
          favourite: innerCity.favourite,
          _id: innerCity._id,
        });
      }
      return forecastBody;
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST);
      console.error(e);
      return e?.message ?? 'Forecast api has problem';
    }
  }

  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Post('favourite')
  async makeFavourite(
    @Res({ passthrough: true }) res: Response,
    @Body('name') name: string,
  ) {
    try {
      return this.toggleFavouriteCity(name);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST);
      return e;
    }
  }

  @Post('unfavourite')
  async removeFavourite(
    @Res({ passthrough: true }) res: Response,
    @Body('name') name: string,
  ) {
    try {
      return this.toggleFavouriteCity(name);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST);
      return e;
    }
  }

  private async toggleFavouriteCity(name: string) {
    const city = await this.cityService.findOneByName(name);
    if (!city) throw new Error(`Has no city with name ${name}`);

    city.favourite = !city.favourite;
    city.save();
    return city;
  }

  private async findOrCreateCity(name: string, user: UserDocument) {
    const city =
      (await this.cityService.findOneByName(name)) ??
      (await this.cityService.create({ name, owner: user._id }));
    return city;
  }
}
