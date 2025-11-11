import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  director: string;

  @Column('text', { array: true })
  actors: string[];

  @Column()
  genre: string;

  @Column()
  duration: number; // in minutes

  @Column()
  releaseDate: Date;

  @Column({ nullable: true })
  poster: string;

  @Column({ nullable: true })
  trailer: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.movie)
  schedules: Schedule[];

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

