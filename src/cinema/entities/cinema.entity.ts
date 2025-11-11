import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity('cinemas')
export class Cinema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'int', default: 0 })
  totalRooms: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.cinema)
  schedules: Schedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

