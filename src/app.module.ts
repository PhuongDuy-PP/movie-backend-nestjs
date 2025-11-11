import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { CinemaModule } from './cinema/cinema.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';
import { BlogModule } from './blog/blog.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    UserModule,
    MovieModule,
    CinemaModule,
    ScheduleModule,
    BookingModule,
    CommentModule,
    BlogModule,
  ],
})
export class AppModule {}

