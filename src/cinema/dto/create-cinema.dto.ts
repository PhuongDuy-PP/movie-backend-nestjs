import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCinemaDto {
  @ApiProperty({ example: 'CGV Vincom', description: 'Cinema name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Nguyen Hue', description: 'Cinema address' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Ho Chi Minh City', description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ example: '0123456789', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 5, description: 'Total rooms', required: false })
  @IsOptional()
  @IsNumber()
  totalRooms?: number;

  @ApiProperty({ example: true, description: 'Cinema is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

