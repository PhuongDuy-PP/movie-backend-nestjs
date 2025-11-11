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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    return this.commentService.create(user.id, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments (optional filter by movieId)' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter by movie ID' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findAll(@Query('movieId') movieId?: string) {
    return this.commentService.findAll(movieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Comment details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update comment (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own comments' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.commentService.update(id, user.id, updateCommentDto, isAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete comment (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own comments' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.commentService.remove(id, user.id, isAdmin);
  }
}

