import { config } from 'dotenv';
import dataSource from '../config/data-source';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entities/user.entity';

config();

async function createAdmin() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const userRepository = dataSource.getRepository(User);

    // Get admin email and password from command line or use defaults
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const fullName = process.argv[4] || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email },
    });

    if (existingAdmin) {
      if (existingAdmin.role === UserRole.ADMIN) {
        console.log(`⚠️  Admin with email ${email} already exists!`);
        if (dataSource.isInitialized) {
          await dataSource.destroy();
        }
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = UserRole.ADMIN;
        await userRepository.save(existingAdmin);
        console.log(`✅ Updated user ${email} to admin role`);
        if (dataSource.isInitialized) {
          await dataSource.destroy();
        }
        process.exit(0);
      }
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(admin);
    console.log(`✅ Admin account created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Full Name: ${fullName}`);
    console.log(`\n⚠️  Please change the password after first login!`);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

createAdmin();

