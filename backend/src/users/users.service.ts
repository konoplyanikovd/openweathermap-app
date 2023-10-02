import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommonDto } from 'src/common.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(user: CommonDto<User>): Promise<UserDocument> {
    const createdCity = new this.userModel(user);
    return createdCity.save();
  }

  findOneByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  findOneByToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ token }).exec();
  }

  findOneByApi(ip: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ ip }).exec();
  }
}
