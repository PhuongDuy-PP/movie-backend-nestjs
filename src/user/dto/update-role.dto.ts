import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;
}

