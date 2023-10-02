import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City, CitySchema } from './schemas/city.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from 'src/history/history.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    HistoryModule,
    UsersModule,
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
