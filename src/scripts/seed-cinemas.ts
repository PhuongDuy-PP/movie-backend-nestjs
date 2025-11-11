import { config } from 'dotenv';
import dataSource from '../config/data-source';
import { Cinema } from '../cinema/entities/cinema.entity';

config();

async function seedCinemas() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const cinemaRepository = dataSource.getRepository(Cinema);

    // Check if cinemas already exist
    const existingCinemas = await cinemaRepository.count();
    if (existingCinemas > 0) {
      console.log(`⚠️  Database already has ${existingCinemas} cinemas. Skipping seed.`);
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    }

    const cinemas = [
      {
        name: 'CGV Landmark 81',
        address: 'Tầng 5, Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh',
        city: 'Hồ Chí Minh',
        phone: '1900 6017',
        totalRooms: 8,
        isActive: true,
      },
      {
        name: 'CGV Vincom Center Đồng Khởi',
        address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1',
        city: 'Hồ Chí Minh',
        phone: '1900 6017',
        totalRooms: 7,
        isActive: true,
      },
      {
        name: 'CGV Crescent Mall',
        address: 'Tầng 5, Crescent Mall, 101 Tôn Dật Tiên, Phường Tân Phú, Quận 7',
        city: 'Hồ Chí Minh',
        phone: '1900 6017',
        totalRooms: 6,
        isActive: true,
      },
      {
        name: 'CGV Vincom Mega Mall Thảo Điền',
        address: '159 Xa Lộ Hà Nội, Phường Thảo Điền, Quận 2',
        city: 'Hồ Chí Minh',
        phone: '1900 6017',
        totalRooms: 6,
        isActive: true,
      },
      {
        name: 'CGV Vincom Center Bà Triệu',
        address: '191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng',
        city: 'Hà Nội',
        phone: '1900 6017',
        totalRooms: 7,
        isActive: true,
      },
      {
        name: 'CGV Royal City',
        address: '72A Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân',
        city: 'Hà Nội',
        phone: '1900 6017',
        totalRooms: 8,
        isActive: true,
      },
      {
        name: 'CGV Mipec Long Biên',
        address: 'Tầng 4, Mipec Long Biên, 229 Nguyễn Văn Cừ, Phường Ngọc Lâm, Quận Long Biên',
        city: 'Hà Nội',
        phone: '1900 6017',
        totalRooms: 5,
        isActive: true,
      },
      {
        name: 'CGV Đà Nẵng',
        address: 'Tầng 4, Vincom Đà Nẵng, 910A Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà',
        city: 'Đà Nẵng',
        phone: '1900 6017',
        totalRooms: 6,
        isActive: true,
      },
    ];

    console.log('🌱 Seeding cinemas...');
    for (const cinemaData of cinemas) {
      const cinema = cinemaRepository.create(cinemaData);
      await cinemaRepository.save(cinema);
      console.log(`✅ Created: ${cinema.name}`);
    }

    console.log(`\n✅ Successfully seeded ${cinemas.length} cinemas!`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding cinemas:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedCinemas();

