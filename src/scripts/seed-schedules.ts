import { config } from 'dotenv';
import dataSource from '../config/data-source';
import { Movie } from '../movie/entities/movie.entity';
import { Cinema } from '../cinema/entities/cinema.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

config();

async function seedSchedules() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const movieRepository = dataSource.getRepository(Movie);
    const cinemaRepository = dataSource.getRepository(Cinema);
    const scheduleRepository = dataSource.getRepository(Schedule);

    // Check if schedules already exist
    const existingSchedules = await scheduleRepository.count();
    if (existingSchedules > 0) {
      console.log(`⚠️  Database already has ${existingSchedules} schedules. Skipping seed.`);
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    }

    // Get all movies and cinemas
    const movies = await movieRepository.find({ where: { isActive: true } });
    const cinemas = await cinemaRepository.find({ where: { isActive: true } });

    if (movies.length === 0) {
      console.log('⚠️  No movies found. Please seed movies first.');
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }

    if (cinemas.length === 0) {
      console.log('⚠️  No cinemas found. Please seed cinemas first.');
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }

    console.log('🌱 Seeding schedules...');

    // Generate schedules for the next 7 days
    const schedules = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const showTimes = ['09:00', '11:30', '14:00', '16:30', '19:00', '21:30'];
    const rooms = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Phòng 4', 'Phòng 5'];
    const prices = [80000, 100000, 120000, 150000]; // VND
    const totalSeats = 150;

    // Create schedules for each movie in each cinema for the next 7 days
    for (let day = 0; day < 7; day++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + day);

      for (const movie of movies.slice(0, 8)) { // Only first 8 movies
        for (const cinema of cinemas) {
          // Random number of showtimes per day (2-4)
          const numShowtimes = Math.floor(Math.random() * 3) + 2;
          const selectedShowtimes = showTimes
            .sort(() => Math.random() - 0.5)
            .slice(0, numShowtimes);

          for (const showTime of selectedShowtimes) {
            const [hours, minutes] = showTime.split(':').map(Number);
            const showDateTime = new Date(scheduleDate);
            showDateTime.setHours(hours, minutes, 0, 0);

            // Skip past showtimes
            if (showDateTime < new Date()) {
              continue;
            }

            const room = rooms[Math.floor(Math.random() * rooms.length)];
            const price = prices[Math.floor(Math.random() * prices.length)];
            const availableSeats = Math.floor(Math.random() * 50) + 50; // 50-100 seats available

            schedules.push({
              movieId: movie.id,
              cinemaId: cinema.id,
              room,
              showTime: showDateTime,
              price,
              totalSeats,
              availableSeats,
              isActive: true,
            });
          }
        }
      }
    }

    // Insert schedules in batches
    const batchSize = 50;
    for (let i = 0; i < schedules.length; i += batchSize) {
      const batch = schedules.slice(i, i + batchSize);
      for (const scheduleData of batch) {
        const schedule = scheduleRepository.create(scheduleData);
        await scheduleRepository.save(schedule);
      }
      console.log(`✅ Created ${Math.min(i + batchSize, schedules.length)}/${schedules.length} schedules...`);
    }

    console.log(`\n✅ Successfully seeded ${schedules.length} schedules!`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedSchedules();

