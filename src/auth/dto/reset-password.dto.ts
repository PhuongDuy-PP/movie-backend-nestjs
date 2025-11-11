import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-here', description: 'Reset password token' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

