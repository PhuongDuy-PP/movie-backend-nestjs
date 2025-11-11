import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create({
      ...createMovieDto,
      releaseDate: new Date(createMovieDto.releaseDate),
    });
    return this.movieRepository.save(movie);
  }

  async findAll(status?: 'now-showing' | 'coming-soon'): Promise<Movie[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryBuilder = this.movieRepository.createQueryBuilder('movie')
      .where('movie.isActive = :isActive', { isActive: true });

    if (status === 'now-showing') {
      queryBuilder.andWhere('movie.releaseDate <= :today', { today });
    } else if (status === 'coming-soon') {
      queryBuilder.andWhere('movie.releaseDate > :today', { today });
    }

    return queryBuilder
      .orderBy('movie.releaseDate', 'DESC')
      .addOrderBy('movie.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['schedules', 'comments'],
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    const updateData: any = { ...updateMovieDto };
    if (updateMovieDto.releaseDate) {
      updateData.releaseDate = new Date(updateMovieDto.releaseDate);
    }
    Object.assign(movie, updateData);
    return this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Movie not found');
    }
  }
}

