import { IsString, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'uuid-here', description: 'Movie ID' })
  @IsString()
  movieId: string;

  @ApiProperty({ example: 'Great movie! Highly recommended.', description: 'Comment content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5 stars)', required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: true, description: 'Comment is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

