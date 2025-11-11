import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'Top 10 Movies of 2024', description: 'Blog title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Here are the top 10 movies...', description: 'Blog content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Blog image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'A brief summary of the blog post', description: 'Blog excerpt', required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: true, description: 'Blog is published', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

