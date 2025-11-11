import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
  ) {}

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const cinema = this.cinemaRepository.create(createCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async findAll(): Promise<Cinema[]> {
    return this.cinemaRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }
    return cinema;
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    const cinema = await this.findOne(id);
    Object.assign(cinema, updateCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cinemaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cinema not found');
    }
  }
}

