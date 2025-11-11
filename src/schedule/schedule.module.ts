import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './entities/schedule.entity';
import { MovieModule } from '../movie/movie.module';
import { CinemaModule } from '../cinema/cinema.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    MovieModule,
    CinemaModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}

