import { config } from 'dotenv';
import dataSource from '../config/data-source';
import { User } from '../user/entities/user.entity';
import { Blog } from '../blog/entities/blog.entity';

config();

async function seedBlogs() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Connected to database');

    const userRepository = dataSource.getRepository(User);
    const blogRepository = dataSource.getRepository(Blog);

    // Check if blogs already exist
    const existingBlogs = await blogRepository.count();
    if (existingBlogs > 0) {
      console.log(`⚠️  Database already has ${existingBlogs} blogs. Skipping seed.`);
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    }

    // Get admin user or first user
    const users = await userRepository.find({ where: { isActive: true } });
    if (users.length === 0) {
      console.log('⚠️  No users found. Please create users first.');
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }

    const adminUser = users.find((u) => u.role === 'admin') || users[0];

    console.log('🌱 Seeding blogs...');

    const blogs = [
      {
        title: 'Top 10 Phim Hay Nhất Năm 2024',
        excerpt: 'Khám phá những bộ phim đình đám nhất năm 2024 với những câu chuyện hấp dẫn và diễn xuất xuất sắc.',
        content: `
          <h2>Top 10 Phim Hay Nhất Năm 2024</h2>
          <p>Năm 2024 đã mang đến cho khán giả nhiều bộ phim đáng chú ý với những câu chuyện hấp dẫn, diễn xuất xuất sắc và hiệu ứng hình ảnh tuyệt đẹp.</p>
          
          <h3>1. Dune: Part Two</h3>
          <p>Phần tiếp theo của epic sci-fi đầy ấn tượng với những cảnh quay hoành tráng và cốt truyện sâu sắc.</p>
          
          <h3>2. Oppenheimer</h3>
          <p>Bộ phim tiểu sử về nhà khoa học đã tạo ra bom nguyên tử, với diễn xuất xuất sắc của Cillian Murphy.</p>
          
          <h3>3. The Batman</h3>
          <p>Phiên bản mới của siêu anh hùng đen tối với Robert Pattinson trong vai Batman.</p>
          
          <p>Và còn nhiều bộ phim hay khác đang chờ bạn khám phá!</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIhbkgXON4YeP1mZ.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
      {
        title: 'Hướng Dẫn Đặt Vé Online Tại CGV',
        excerpt: 'Cách đặt vé xem phim online nhanh chóng và tiện lợi tại CGV.',
        content: `
          <h2>Hướng Dẫn Đặt Vé Online Tại CGV</h2>
          <p>Đặt vé online tại CGV rất đơn giản và tiện lợi. Chỉ cần vài bước là bạn đã có thể sở hữu vé xem phim yêu thích.</p>
          
          <h3>Bước 1: Chọn Phim</h3>
          <p>Vào trang web và chọn phim bạn muốn xem.</p>
          
          <h3>Bước 2: Chọn Rạp và Suất Chiếu</h3>
          <p>Chọn rạp chiếu gần nhất và suất chiếu phù hợp với lịch trình của bạn.</p>
          
          <h3>Bước 3: Chọn Ghế</h3>
          <p>Chọn ghế ngồi mà bạn muốn từ sơ đồ ghế trên màn hình.</p>
          
          <h3>Bước 4: Thanh Toán</h3>
          <p>Thanh toán bằng thẻ tín dụng, thẻ ghi nợ hoặc ví điện tử.</p>
          
          <p>Vậy là xong! Bạn sẽ nhận được mã vé qua email.</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
      {
        title: 'Khuyến Mãi Đặc Biệt Tháng 11',
        excerpt: 'Nhận ngay ưu đãi lên đến 50% khi đặt vé trong tháng 11.',
        content: `
          <h2>Khuyến Mãi Đặc Biệt Tháng 11</h2>
          <p>Tháng 11 này, CGV mang đến cho khán giả nhiều ưu đãi hấp dẫn:</p>
          
          <ul>
            <li>Giảm 50% cho vé 2D vào thứ 2 hàng tuần</li>
            <li>Combo bắp nước chỉ 99.000đ</li>
            <li>Tặng vé xem phim khi mua combo lớn</li>
            <li>Ưu đãi đặc biệt cho thành viên CGV</li>
          </ul>
          
          <p>Đừng bỏ lỡ cơ hội này! Đặt vé ngay hôm nay.</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
      {
        title: 'Review: Dune: Part Two - Epic Sci-Fi Masterpiece',
        excerpt: 'Đánh giá chi tiết về bộ phim Dune: Part Two với những phân tích sâu sắc về cốt truyện và hình ảnh.',
        content: `
          <h2>Review: Dune: Part Two</h2>
          <p>Dune: Part Two là một kiệt tác sci-fi với những cảnh quay hoành tráng và cốt truyện sâu sắc.</p>
          
          <h3>Điểm Mạnh</h3>
          <ul>
            <li>Hình ảnh tuyệt đẹp với những cảnh quay hoành tráng</li>
            <li>Diễn xuất xuất sắc từ dàn diễn viên</li>
            <li>Cốt truyện hấp dẫn và đầy kịch tính</li>
            <li>Âm thanh và nhạc nền ấn tượng</li>
          </ul>
          
          <h3>Đánh Giá</h3>
          <p>Dune: Part Two xứng đáng được đánh giá 5/5 sao. Đây là một bộ phim không thể bỏ lỡ!</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIhbkgXON4YeP1mZ.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
      {
        title: 'Lịch Chiếu Phim Mới Tháng 12/2024',
        excerpt: 'Cập nhật lịch chiếu các phim mới ra mắt trong tháng 12/2024.',
        content: `
          <h2>Lịch Chiếu Phim Mới Tháng 12/2024</h2>
          <p>Tháng 12/2024 sẽ có nhiều bộ phim mới ra mắt:</p>
          
          <ul>
            <li><strong>Deadpool & Wolverine</strong> - Ngày 26/12/2024</li>
            <li><strong>Avatar 3</strong> - Ngày 19/12/2024</li>
            <li><strong>Spider-Man: Beyond the Spider-Verse</strong> - Ngày 12/12/2024</li>
          </ul>
          
          <p>Đặt vé ngay để không bỏ lỡ những bộ phim hấp dẫn này!</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/7Py8hsCR7B0IJCS7psBga8hxZ9x.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
      {
        title: 'Trải Nghiệm Xem Phim IMAX Tại CGV',
        excerpt: 'Khám phá trải nghiệm xem phim IMAX đẳng cấp tại CGV với màn hình lớn và âm thanh vòm sống động.',
        content: `
          <h2>Trải Nghiệm Xem Phim IMAX Tại CGV</h2>
          <p>IMAX là công nghệ chiếu phim tiên tiến nhất với màn hình lớn và âm thanh vòm sống động.</p>
          
          <h3>Ưu Điểm Của IMAX</h3>
          <ul>
            <li>Màn hình lớn gấp 8 lần màn hình thông thường</li>
            <li>Âm thanh vòm 12 kênh sống động</li>
            <li>Chất lượng hình ảnh 4K sắc nét</li>
            <li>Trải nghiệm xem phim đẳng cấp</li>
          </ul>
          
          <p>Hãy thử trải nghiệm IMAX tại CGV ngay hôm nay!</p>
        `,
        image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        authorId: adminUser.id,
        isPublished: true,
        views: 0,
      },
    ];

    for (const blogData of blogs) {
      const blog = blogRepository.create(blogData);
      await blogRepository.save(blog);
      console.log(`✅ Created: ${blog.title}`);
    }

    console.log(`\n✅ Successfully seeded ${blogs.length} blogs!`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedBlogs();

