import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommonDto } from 'src/common.dto';
import { History } from './schemas/history.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  create(historyDto: CommonDto<History>) {
    return this.historyModel.create(historyDto);
  }

  findAll() {
    return this.historyModel.find();
  }

  findBy(
    key: keyof CommonDto<History>,
    value: string | mongoose.Types.ObjectId,
  ) {
    return this.historyModel.find({ [key]: value });
  }

  remove(id: string) {
    return this.historyModel.findByIdAndRemove(id);
  }

  async clearBy(
    key: keyof CommonDto<History>,
    value: string | mongoose.Types.ObjectId,
  ) {
    return (await this.findBy(key, value)).forEach(
      async (x) => await this.remove(x._id.toString()),
    );
  }
}
