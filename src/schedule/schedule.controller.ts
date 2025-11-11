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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new schedule (Admin only)' })
  @ApiResponse({ status: 201, description: 'Schedule successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedules (optional filter by movieId or cinemaId)' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter by movie ID' })
  @ApiQuery({ name: 'cinemaId', required: false, description: 'Filter by cinema ID' })
  @ApiResponse({ status: 200, description: 'List of schedules' })
  findAll(@Query('movieId') movieId?: string, @Query('cinemaId') cinemaId?: string) {
    if (movieId) {
      return this.scheduleService.findByMovie(movieId);
    }
    if (cinemaId) {
      return this.scheduleService.findByCinema(cinemaId);
    }
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Schedule details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update schedule (Admin only)' })
  @ApiParam({ name: 'id', description: 'Schedule ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Schedule successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete schedule (Admin only)' })
  @ApiParam({ name: 'id', description: 'Schedule ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Schedule successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.scheduleService.remove(id);
  }
}

