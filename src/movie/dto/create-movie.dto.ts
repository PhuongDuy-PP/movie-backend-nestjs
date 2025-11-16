import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsDateString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A computer hacker learns about the true nature of reality' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Lana Wachowski' })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({ example: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'] })
  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @ApiProperty({ example: 'Sci-Fi' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ example: 136 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: '1999-03-31' })
  @IsDateString()
  releaseDate: string;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=vKQi3bBA1y8' })
  @IsOptional()
  @IsUrl()
  trailer?: string;

  @ApiPropertyOptional({ example: 8.5, description: 'Movie rating (0-10)', required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
