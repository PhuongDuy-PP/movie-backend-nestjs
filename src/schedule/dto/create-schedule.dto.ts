import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 'uuid-here', description: 'Movie ID' })
  @IsString()
  movieId: string;

  @ApiProperty({ example: 'uuid-here', description: 'Cinema ID' })
  @IsString()
  cinemaId: string;

  @ApiProperty({ example: 'Room 1', description: 'Room name' })
  @IsString()
  room: string;

  @ApiProperty({ example: '2024-12-25T14:00:00Z', description: 'Show time' })
  @IsDateString()
  showTime: string;

  @ApiProperty({ example: 150000, description: 'Ticket price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100, description: 'Total seats' })
  @IsNumber()
  totalSeats: number;

  @ApiProperty({ example: 100, description: 'Available seats', required: false })
  @IsOptional()
  @IsNumber()
  availableSeats?: number;

  @ApiProperty({ example: true, description: 'Schedule is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

