import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(userId: string, createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create({
      ...createBlogDto,
      authorId: userId,
    });
    return this.blogRepository.save(blog);
  }

  async findAll(publishedOnly: boolean = false): Promise<Blog[]> {
    const where = publishedOnly ? { isPublished: true } : {};
    return this.blogRepository.find({
      where,
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Increment views
    blog.views += 1;
    await this.blogRepository.save(blog);

    return blog;
  }

  async update(
    id: string,
    userId: string,
    updateBlogDto: UpdateBlogDto,
    isAdmin: boolean = false,
  ): Promise<Blog> {
    const blog = await this.findOne(id);

    if (!isAdmin && blog.authorId !== userId) {
      throw new ForbiddenException('You can only update your own blog posts');
    }

    Object.assign(blog, updateBlogDto);
    return this.blogRepository.save(blog);
  }

  async remove(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const blog = await this.findOne(id);

    if (!isAdmin && blog.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own blog posts');
    }

    await this.blogRepository.remove(blog);
  }
}

