import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type HistoryDocument = HydratedDocument<History>;

@Schema()
export class History {
  @Prop({
    default: 'City',
  })
  entity: string;

  @Prop({
    required: true,
  })
  value: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: mongoose.Types.ObjectId;
}

export const HistorySchema = SchemaFactory.createForClass(History);
