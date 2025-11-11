import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Not enough seats or seats already booked' })
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingService.create(user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings (User: own bookings, Admin: all bookings)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  findAll(@CurrentUser() user: User, @Query('userId') userId?: string) {
    if (user.role === UserRole.ADMIN) {
      return this.bookingService.findAll(userId);
    }
    return this.bookingService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.bookingService.findOne(id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Booking successfully cancelled' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format or cannot cancel past showtimes' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.bookingService.cancel(id, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a booking (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Booking successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.remove(id);
  }
}

