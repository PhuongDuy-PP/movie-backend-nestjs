import { config } from 'dotenv';
import dataSource from '../config/data-source';
import { Movie } from '../movie/entities/movie.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';

config();

async function seedComments() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const movieRepository = dataSource.getRepository(Movie);
    const userRepository = dataSource.getRepository(User);
    const commentRepository = dataSource.getRepository(Comment);

    // Check if comments already exist
    const existingComments = await commentRepository.count();
    if (existingComments > 0) {
      console.log(`⚠️  Database already has ${existingComments} comments. Skipping seed.`);
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    }

    // Get all movies and users
    const movies = await movieRepository.find({ where: { isActive: true } });
    const users = await userRepository.find({ where: { isActive: true } });

    if (movies.length === 0) {
      console.log('⚠️  No movies found. Please seed movies first.');
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }

    if (users.length === 0) {
      console.log('⚠️  No users found. Please create users first.');
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }

    console.log('🌱 Seeding comments...');

    const commentsData = [
      {
        content: 'Phim rất hay! Diễn xuất xuất sắc, cốt truyện hấp dẫn. Đáng xem!',
        rating: 5,
      },
      {
        content: 'Tuyệt vời! Hiệu ứng hình ảnh đẹp mắt, âm thanh sống động.',
        rating: 5,
      },
      {
        content: 'Phim hay nhưng có một số điểm chưa thỏa mãn. Vẫn đáng xem!',
        rating: 4,
      },
      {
        content: 'Diễn viên diễn xuất tốt, nhưng cốt truyện hơi dài dòng.',
        rating: 3,
      },
      {
        content: 'Phim đáng xem! Khuyến nghị mọi người nên đi xem.',
        rating: 5,
      },
      {
        content: 'Tốt nhưng không xuất sắc. Vẫn đáng giá vé.',
        rating: 4,
      },
      {
        content: 'Phim hay, đặc biệt là phần hiệu ứng và âm thanh.',
        rating: 4,
      },
      {
        content: 'Tuyệt vời từ đầu đến cuối! Không thể bỏ lỡ!',
        rating: 5,
      },
      {
        content: 'Phim ổn, có một số điểm hay nhưng cũng có phần hơi nhàm chán.',
        rating: 3,
      },
      {
        content: 'Đáng xem! Cốt truyện hay, diễn viên diễn xuất tốt.',
        rating: 4,
      },
    ];

    const comments = [];
    for (const movie of movies) {
      // Create 3-5 comments per movie
      const numComments = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numComments; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment = commentsData[Math.floor(Math.random() * commentsData.length)];
        
        comments.push({
          userId: randomUser.id,
          movieId: movie.id,
          content: randomComment.content,
          rating: randomComment.rating,
          isActive: true,
        });
      }
    }

    // Insert comments
    for (let i = 0; i < comments.length; i++) {
      const commentData = comments[i];
      const comment = commentRepository.create(commentData);
      await commentRepository.save(comment);
      if ((i + 1) % 10 === 0 || i + 1 === comments.length) {
        console.log(`✅ Created ${i + 1}/${comments.length} comments...`);
      }
    }

    console.log(`\n✅ Successfully seeded ${comments.length} comments!`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding comments:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedComments();

