import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post successfully created' })
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogService.create(user.id, createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts (optional filter by published)' })
  @ApiQuery({ name: 'published', required: false, description: 'Filter published posts (true/false)' })
  @ApiResponse({ status: 200, description: 'List of blog posts' })
  findAll(@Query('published') published?: string) {
    const publishedOnly = published === 'true';
    return this.blogService.findAll(publishedOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog post ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Blog post details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog post (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Blog post ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Blog post successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own blog posts' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: User,
  ) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.blogService.update(id, user.id, updateBlogDto, isAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog post (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Blog post ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Blog post successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own blog posts' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.blogService.remove(id, user.id, isAdmin);
  }
}

