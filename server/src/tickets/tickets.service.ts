import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

export function completionPercent(resolved: number, total: number): number {
  return total === 0 ? 0 : Math.round((resolved / total) * 100);
}

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private readonly tickets: Model<Ticket>) {}

  async create(dto: CreateTicketDto, user: { userId: string; email: string }) {
    return this.tickets.create({
      ...dto,
      category: dto.category || TicketCategory.OTHER,
      createdBy: new Types.ObjectId(user.userId),
      messages: [{ authorId: new Types.ObjectId(user.userId), authorName: user.email.split('@')[0], body: dto.description }],
    });
  }

  async list(userId: string, filters: { status?: string; priority?: string; search?: string } = {}) {
    const query: any = { createdBy: userId };
    if (filters.status && Object.values(TicketStatus).includes(filters.status as TicketStatus)) query.status = filters.status;
    if (filters.priority && Object.values(TicketPriority).includes(filters.priority as TicketPriority)) query.priority = filters.priority;
    if (filters.search?.trim()) {
      const safe = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [{ subject: { $regex: safe, $options: 'i' } }, { description: { $regex: safe, $options: 'i' } }];
    }
    return this.tickets.find(query).sort({ updatedAt: -1 }).limit(100).lean();
  }

  async findAccessible(ticketId: string, userId: string) {
    if (!isValidObjectId(ticketId)) throw new NotFoundException('Ticket not found');
    const ticket = await this.tickets.findOne({ _id: ticketId, createdBy: userId });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(ticketId: string, dto: UpdateTicketDto, userId: string) {
    const ticket = await this.findAccessible(ticketId, userId);
    if (dto.status) ticket.status = dto.status;
    if (dto.priority) ticket.priority = dto.priority;
    if (dto.category) ticket.category = dto.category;
    if (dto.sentiment) ticket.sentiment = dto.sentiment;
    return ticket.save();
  }

  async addReply(ticketId: string, body: string, user: { userId: string; email: string }) {
    const ticket = await this.findAccessible(ticketId, user.userId);
    ticket.messages.push({ authorId: new Types.ObjectId(user.userId), authorName: user.email.split('@')[0], body, createdAt: new Date() } as never);
    return ticket.save();
  }

  async summary(userId: string) {
    const [total, open, inProgress, waiting, resolved, urgent] = await Promise.all([
      this.tickets.countDocuments({ createdBy: userId }),
      this.tickets.countDocuments({ createdBy: userId, status: TicketStatus.OPEN }),
      this.tickets.countDocuments({ createdBy: userId, status: TicketStatus.IN_PROGRESS }),
      this.tickets.countDocuments({ createdBy: userId, status: TicketStatus.WAITING }),
      this.tickets.countDocuments({ createdBy: userId, status: TicketStatus.RESOLVED }),
      this.tickets.countDocuments({ createdBy: userId, priority: TicketPriority.URGENT, status: { $ne: TicketStatus.RESOLVED } }),
    ]);
    return { total, open, inProgress, waiting, resolved, urgent, resolutionRate: completionPercent(resolved, total) };
  }
}
