import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  token: string;

  @Prop()
  ip: string;

  @Prop()
  firstRequest: string;

  @Prop({
    default: 0,
  })
  countRequest: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
