import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findByEmail(email);

    // Don't reveal if user exists or not for security
    if (!user) {
      // Return success message even if user doesn't exist (security best practice)
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1); // Token expires in 1 hour

    // Save reset token to user
    await this.userService.updateResetToken(user.id, resetPasswordToken, resetPasswordExpires);

    // In production, send email with reset link
    // For now, we'll return the token (only for development/testing)
    // In production, remove this and send email instead
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

    console.log('=== PASSWORD RESET TOKEN (DEV ONLY) ===');
    console.log(`Email: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('=======================================');

    // TODO: Send email with reset link
    // await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return {
      message: 'If the email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      ...(process.env.NODE_ENV !== 'production' && {
        resetToken,
        resetUrl,
      }),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this token and check if it's not expired
    const user = await this.userService.findByResetToken(resetPasswordToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await this.userService.updatePassword(user.id, hashedPassword);

    return {
      message: 'Password has been reset successfully',
    };
  }
}

