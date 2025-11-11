import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { Cinema } from '../../cinema/entities/cinema.entity';
import { Ticket } from '../../booking/entities/ticket.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, (movie) => movie.schedules)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.schedules)
  @JoinColumn({ name: 'cinemaId' })
  cinema: Cinema;

  @Column()
  cinemaId: string;

  @Column()
  room: string;

  @Column({ type: 'timestamp' })
  showTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  totalSeats: number;

  @Column({ type: 'int', default: 0 })
  availableSeats: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.schedule)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

