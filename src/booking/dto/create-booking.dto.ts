import { IsString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-here', description: 'Schedule ID' })
  @IsString()
  scheduleId: string;

  @ApiProperty({ example: ['A1', 'A2', 'A3'], description: 'Seat numbers', type: [String] })
  @IsArray()
  @IsString({ each: true })
  seats: string[];

  @ApiProperty({ example: 3, description: 'Number of tickets' })
  @IsNumber()
  quantity: number;
}

