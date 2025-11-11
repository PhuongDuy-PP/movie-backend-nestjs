import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';
import { Cinema } from '../cinema/entities/cinema.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Ticket } from '../booking/entities/ticket.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'movie_db',
  entities: [User, Movie, Cinema, Schedule, Ticket, Comment, Blog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

