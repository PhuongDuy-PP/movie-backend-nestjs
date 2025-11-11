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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('cinemas')
@Controller('cinemas')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new cinema (Admin only)' })
  @ApiResponse({ status: 201, description: 'Cinema successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemaService.create(createCinemaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cinemas' })
  @ApiResponse({ status: 200, description: 'List of cinemas' })
  findAll() {
    return this.cinemaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cinema by ID' })
  @ApiParam({ name: 'id', description: 'Cinema ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Cinema details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cinemaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update cinema (Admin only)' })
  @ApiParam({ name: 'id', description: 'Cinema ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Cinema successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    return this.cinemaService.update(id, updateCinemaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete cinema (Admin only)' })
  @ApiParam({ name: 'id', description: 'Cinema ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Cinema successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cinemaService.remove(id);
  }
}

