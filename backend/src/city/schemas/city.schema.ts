import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    default: false,
  })
  favourite: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: mongoose.Types.ObjectId;
}

export const CitySchema = SchemaFactory.createForClass(City);
