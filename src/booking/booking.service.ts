import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { TicketStatus } from './entities/ticket.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private scheduleService: ScheduleService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Ticket> {
    const schedule = await this.scheduleService.findOne(createBookingDto.scheduleId);

    if (schedule.availableSeats < createBookingDto.quantity) {
      throw new BadRequestException('Not enough available seats');
    }

    if (new Date(schedule.showTime) < new Date()) {
      throw new BadRequestException('Cannot book past showtimes');
    }

    // Check if seats are already booked
    const existingTickets = await this.ticketRepository.find({
      where: {
        scheduleId: createBookingDto.scheduleId,
        status: TicketStatus.CONFIRMED,
      },
    });

    const bookedSeats = existingTickets.flatMap((ticket) => ticket.seats);
    const conflictingSeats = createBookingDto.seats.filter((seat) =>
      bookedSeats.includes(seat),
    );

    if (conflictingSeats.length > 0) {
      throw new BadRequestException(`Seats ${conflictingSeats.join(', ')} are already booked`);
    }

    const totalPrice = schedule.price * createBookingDto.quantity;

    const ticket = this.ticketRepository.create({
      userId,
      scheduleId: createBookingDto.scheduleId,
      seats: createBookingDto.seats,
      quantity: createBookingDto.quantity,
      totalPrice,
      status: TicketStatus.CONFIRMED,
    });

    // Update available seats
    schedule.availableSeats -= createBookingDto.quantity;
    await this.scheduleService.update(createBookingDto.scheduleId, {
      availableSeats: schedule.availableSeats,
    });

    return this.ticketRepository.save(ticket);
  }

  async findAll(userId?: string): Promise<Ticket[]> {
    const where = userId ? { userId } : {};
    return this.ticketRepository.find({
      where,
      relations: ['user', 'schedule', 'schedule.movie', 'schedule.cinema'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Ticket> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    const ticket = await this.ticketRepository.findOne({
      where,
      relations: ['user', 'schedule', 'schedule.movie', 'schedule.cinema'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async cancel(id: string, userId: string): Promise<Ticket> {
    const ticket = await this.findOne(id, userId);

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Ticket is already cancelled');
    }

    if (new Date(ticket.schedule.showTime) < new Date()) {
      throw new BadRequestException('Cannot cancel past showtimes');
    }

    ticket.status = TicketStatus.CANCELLED;

    // Restore available seats
    const schedule = await this.scheduleService.findOne(ticket.scheduleId);
    schedule.availableSeats += ticket.quantity;
    await this.scheduleService.update(ticket.scheduleId, {
      availableSeats: schedule.availableSeats,
    });

    return this.ticketRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ticket not found');
    }
  }
}

