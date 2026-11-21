import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export enum UserRole { ADMIN = 'admin', MEMBER = 'member' }
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 80 }) name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) email: string;
  @Prop({ required: true, select: false }) passwordHash: string;
  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER }) role: UserRole;
  @Prop({ default: true }) isActive: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
