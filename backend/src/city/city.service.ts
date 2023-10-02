import { Injectable } from '@nestjs/common';
import { City, CityDocument } from './schemas/city.schema';
import { CommonDto } from 'src/common.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  create(city: CommonDto<City>): Promise<CityDocument> {
    const createdCity = new this.cityModel(city);
    return createdCity.save();
  }

  findAll() {
    return this.cityModel.find().exec();
  }

  findBy(
    key: 'owner' | 'name' | 'favourite',
    value: string | mongoose.Types.ObjectId,
  ) {
    return this.cityModel.find({ [key]: value }).exec();
  }

  findOneByName(name: string): Promise<CityDocument | null> {
    return this.cityModel.findOne({ name }).exec();
  }

  async update(id: string, city: CommonDto<City>) {
    return this.cityModel.findByIdAndUpdate(id, city).exec();
  }
}
