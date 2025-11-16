import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = this.userRepository.create({
      ...userData,
      role: (userData.role || UserRole.USER) as UserRole,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
    });

    const savedUser = await this.userRepository.save(user);
    // Return user without password
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'fullName', 'phone', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'fullName', 'phone', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    // Handle password update
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      // Remove password from update data if not provided
      const { password, ...updateDataWithoutPassword } = userData as any;
      userData = updateDataWithoutPassword;
    }

    // Check if email is being updated and if it already exists
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async updateRole(id: string, role: string): Promise<User> {
    await this.userRepository.update(id, { role: role as any });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async updateResetToken(id: string, resetToken: string, resetExpires: Date): Promise<void> {
    await this.userRepository.update(id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: resetToken },
      select: ['id', 'email', 'password', 'fullName', 'phone', 'role', 'isActive', 'resetPasswordToken', 'resetPasswordExpires', 'createdAt', 'updatedAt'],
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async updateAvatar(id: string, avatarPath: string): Promise<User> {
    const user = await this.findOne(id);
    
    // Xóa avatar cũ nếu có
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        try {
          fs.unlinkSync(oldAvatarPath);
        } catch (error) {
          // Ignore error nếu file không tồn tại
        }
      }
    }

    await this.userRepository.update(id, { avatar: avatarPath });
    return this.findOne(id);
  }
}
