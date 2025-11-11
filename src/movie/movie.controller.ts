import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { multerOptions } from '../common/interceptors/file-upload.interceptor';
import { ConfigService } from '@nestjs/config';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new movie (Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Post('upload-poster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload movie poster (Admin only)' })
  @ApiResponse({ status: 201, description: 'Poster successfully uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  uploadPoster(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    const filePath = `/uploads/posters/${file.filename}`;
    const fullUrl = `${baseUrl}${filePath}`;

    return {
      message: 'Poster uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      path: filePath,
      url: fullUrl,
      size: file.size,
    };
  }

  @Post(':id/poster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Movie ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload and update movie poster (Admin only)' })
  @ApiResponse({ status: 200, description: 'Poster successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format or file format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async updatePoster(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    const filePath = `/uploads/posters/${file.filename}`;
    const fullUrl = `${baseUrl}${filePath}`;

    // Update movie with new poster URL
    await this.movieService.update(id, { poster: fullUrl });

    return {
      message: 'Poster updated successfully',
      filename: file.filename,
      originalName: file.originalname,
      path: filePath,
      url: fullUrl,
      size: file.size,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies' })
  findAll(@Query('status') status?: 'now-showing' | 'coming-soon') {
    return this.movieService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Movie details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update movie (Admin only)' })
  @ApiParam({ name: 'id', description: 'Movie ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Movie successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete movie (Admin only)' })
  @ApiParam({ name: 'id', description: 'Movie ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Movie successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.movieService.remove(id);
  }
}
