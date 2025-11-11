import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { MovieService } from '../movie/movie.service';
import { CinemaService } from '../cinema/cinema.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private movieService: MovieService,
    private cinemaService: CinemaService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    await this.movieService.findOne(createScheduleDto.movieId);
    await this.cinemaService.findOne(createScheduleDto.cinemaId);

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      showTime: new Date(createScheduleDto.showTime),
      availableSeats: createScheduleDto.availableSeats ?? createScheduleDto.totalSeats,
    });
    return this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { isActive: true },
      relations: ['movie', 'cinema'],
      order: { showTime: 'ASC' },
    });
  }

  async findByMovie(movieId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { movieId, isActive: true },
      relations: ['movie', 'cinema'],
      order: { showTime: 'ASC' },
    });
  }

  async findByCinema(cinemaId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { cinemaId, isActive: true },
      relations: ['movie', 'cinema'],
      order: { showTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['movie', 'cinema', 'tickets'],
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    const updateData: any = { ...updateScheduleDto };
    if (updateScheduleDto.showTime) {
      updateData.showTime = new Date(updateScheduleDto.showTime);
    }
    Object.assign(schedule, updateData);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Schedule not found');
    }
  }
}

