import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;
export enum TicketStatus { OPEN = 'open', IN_PROGRESS = 'in_progress', WAITING = 'waiting', RESOLVED = 'resolved' }
export enum TicketPriority { LOW = 'low', MEDIUM = 'medium', HIGH = 'high', URGENT = 'urgent' }
export enum TicketSentiment { POSITIVE = 'positive', NEUTRAL = 'neutral', NEGATIVE = 'negative' }
export enum TicketCategory { BILLING = 'billing', ACCOUNT = 'account', TECHNICAL = 'technical', DELIVERY = 'delivery', OTHER = 'other' }

@Schema({ _id: false })
export class TicketMessage {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' }) authorId: Types.ObjectId;
  @Prop({ required: true, trim: true, maxlength: 80 }) authorName: string;
  @Prop({ required: true, trim: true, maxlength: 4000 }) body: string;
  @Prop({ default: Date.now }) createdAt: Date;
}
export const TicketMessageSchema = SchemaFactory.createForClass(TicketMessage);

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, trim: true, minlength: 4, maxlength: 140 }) subject: string;
  @Prop({ required: true, trim: true, minlength: 10, maxlength: 5000 }) description: string;
  @Prop({ type: String, enum: TicketCategory, default: TicketCategory.OTHER, index: true }) category: TicketCategory;
  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.OPEN, index: true }) status: TicketStatus;
  @Prop({ type: String, enum: TicketPriority, default: TicketPriority.MEDIUM, index: true }) priority: TicketPriority;
  @Prop({ type: String, enum: TicketSentiment, default: TicketSentiment.NEUTRAL }) sentiment: TicketSentiment;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true }) createdBy: Types.ObjectId;
  @Prop({ type: [TicketMessageSchema], default: [] }) messages: TicketMessage[];
  @Prop({ default: '' , maxlength: 2000 }) aiSummary: string;
  @Prop({ default: null }) lastAiActionAt: Date | null;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.index({ createdBy: 1, status: 1, updatedAt: -1 });
TicketSchema.index({ createdBy: 1, priority: 1, updatedAt: -1 });
