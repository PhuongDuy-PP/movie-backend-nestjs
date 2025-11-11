import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private movieService: MovieService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    await this.movieService.findOne(createCommentDto.movieId);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
      rating: createCommentDto.rating || 0,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Update movie rating
    await this.updateMovieRating(createCommentDto.movieId);

    return savedComment;
  }

  async findAll(movieId?: string): Promise<Comment[]> {
    const where = movieId ? { movieId, isActive: true } : { isActive: true };
    return this.commentRepository.find({
      where,
      relations: ['user', 'movie'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'movie'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
    isAdmin: boolean = false,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (!isAdmin && comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);

    // Update movie rating if rating changed
    if (updateCommentDto.rating !== undefined) {
      await this.updateMovieRating(comment.movieId);
    }

    return updatedComment;
  }

  async remove(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const comment = await this.findOne(id);

    if (!isAdmin && comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);

    // Update movie rating
    await this.updateMovieRating(comment.movieId);
  }

  private async updateMovieRating(movieId: string): Promise<void> {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.movieId = :movieId', { movieId })
      .andWhere('comment.isActive = :isActive', { isActive: true })
      .andWhere('comment.rating > :minRating', { minRating: 0 })
      .getMany();

    if (comments.length > 0) {
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
      const averageRating = totalRating / comments.length;
      await this.movieService.update(movieId, { rating: averageRating });
    }
  }
}

