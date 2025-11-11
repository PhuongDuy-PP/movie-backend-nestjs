# Hướng Dẫn Seed Tất Cả Data Mẫu

## Tổng quan

Script seed data sẽ thêm dữ liệu mẫu cho:
- ✅ Movies (Phim)
- ✅ Cinemas (Rạp chiếu)
- ✅ Schedules (Lịch chiếu)
- ✅ Comments (Bình luận)
- ✅ Blogs (Blog/Tin tức)

## Thứ tự seed (Quan trọng!)

Phải seed theo thứ tự sau vì có dependencies:

1. **Movies** - Phải seed trước
2. **Cinemas** - Phải seed trước schedules
3. **Schedules** - Cần movies và cinemas
4. **Comments** - Cần movies và users (phải có user trước)
5. **Blogs** - Cần users (phải có user trước)

## Cách seed

### Cách 1: Seed tất cả cùng lúc (Khuyến nghị)

```bash
npm run seed:all
```

### Cách 2: Seed từng phần

```bash
# 1. Seed movies (phải làm đầu tiên)
npm run seed:movies

# 2. Seed cinemas
npm run seed:cinemas

# 3. Seed schedules (cần movies và cinemas)
npm run seed:schedules

# 4. Tạo admin/user trước (nếu chưa có)
npm run create:admin

# 5. Seed comments (cần movies và users)
npm run seed:comments

# 6. Seed blogs (cần users)
npm run seed:blogs
```

## Dữ liệu sẽ được seed

### 1. Movies (12 phim)
- Dune: Part Two, Oppenheimer, The Batman, Spider-Man: Across the Spider-Verse, Top Gun: Maverick, Avatar: The Way of Water, Everything Everywhere All at Once, John Wick: Chapter 4, Deadpool & Wolverine, The Matrix Resurrections, Interstellar, Inception

### 2. Cinemas (8 rạp)
- CGV Landmark 81 (Hồ Chí Minh)
- CGV Vincom Center Đồng Khởi (Hồ Chí Minh)
- CGV Crescent Mall (Hồ Chí Minh)
- CGV Vincom Mega Mall Thảo Điền (Hồ Chí Minh)
- CGV Vincom Center Bà Triệu (Hà Nội)
- CGV Royal City (Hà Nội)
- CGV Mipec Long Biên (Hà Nội)
- CGV Đà Nẵng (Đà Nẵng)

### 3. Schedules (Hundreds of schedules)
- Lịch chiếu cho 7 ngày tới
- Mỗi phim có lịch chiếu ở nhiều rạp
- Nhiều suất chiếu mỗi ngày (09:00, 11:30, 14:00, 16:30, 19:00, 21:30)
- Giá vé: 80,000 - 150,000 VND
- Phòng chiếu: Phòng 1-5
- Tổng số ghế: 150 ghế/phòng

### 4. Comments (30-60 comments)
- 3-5 bình luận cho mỗi phim
- Rating: 3-5 sao
- Nội dung đa dạng

### 5. Blogs (6 bài viết)
- Top 10 Phim Hay Nhất Năm 2024
- Hướng Dẫn Đặt Vé Online Tại CGV
- Khuyến Mãi Đặc Biệt Tháng 11
- Review: Dune: Part Two
- Lịch Chiếu Phim Mới Tháng 12/2024
- Trải Nghiệm Xem Phim IMAX Tại CGV

## Lưu ý

### 1. Phải có User trước khi seed Comments và Blogs

```bash
# Tạo admin user trước
npm run create:admin admin@example.com password123 "Admin User"

# Hoặc đăng ký user qua API
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Script sẽ không seed lại nếu đã có data

Mỗi script sẽ kiểm tra nếu đã có data thì sẽ skip.

### 3. Nếu muốn seed lại từ đầu

```sql
-- Xóa tất cả data (CẨN THẬN!)
DELETE FROM comments;
DELETE FROM blogs;
DELETE FROM tickets;
DELETE FROM schedules;
DELETE FROM cinemas;
DELETE FROM movies;
-- KHÔNG XÓA users nếu muốn giữ lại!
```

Sau đó chạy lại:
```bash
npm run seed:all
```

## Kiểm tra data

### Kiểm tra số lượng

```sql
-- Kiểm tra movies
SELECT COUNT(*) FROM movies;

-- Kiểm tra cinemas
SELECT COUNT(*) FROM cinemas;

-- Kiểm tra schedules
SELECT COUNT(*) FROM schedules;

-- Kiểm tra comments
SELECT COUNT(*) FROM comments;

-- Kiểm tra blogs
SELECT COUNT(*) FROM blogs;
```

### Kiểm tra schedules

```sql
-- Xem lịch chiếu của một phim
SELECT s.*, m.title, c.name as cinema_name
FROM schedules s
JOIN movies m ON s."movieId" = m.id
JOIN cinemas c ON s."cinemaId" = c.id
WHERE m.title = 'Dune: Part Two'
ORDER BY s."showTime" ASC;

-- Xem lịch chiếu của một rạp
SELECT s.*, m.title
FROM schedules s
JOIN movies m ON s."movieId" = m.id
WHERE s."cinemaId" = '<cinema-id>'
ORDER BY s."showTime" ASC;
```

### Kiểm tra comments

```sql
-- Xem comments của một phim
SELECT c.*, u."fullName", m.title
FROM comments c
JOIN users u ON c."userId" = u.id
JOIN movies m ON c."movieId" = m.id
WHERE m.title = 'Dune: Part Two'
ORDER BY c."createdAt" DESC;
```

## Troubleshooting

### Lỗi: "No movies found"
```bash
npm run seed:movies
```

### Lỗi: "No cinemas found"
```bash
npm run seed:cinemas
```

### Lỗi: "No users found"
```bash
npm run create:admin
# Hoặc đăng ký user qua API
```

### Lỗi: Foreign key constraint
- Đảm bảo seed theo đúng thứ tự
- Kiểm tra movies và cinemas đã được seed chưa
- Kiểm tra users đã được tạo chưa

## Quick Start

```bash
# 1. Tạo admin user
npm run create:admin admin@example.com password123 "Admin User"

# 2. Seed tất cả data
npm run seed:all

# 3. Kiểm tra
curl http://localhost:3000/movies
curl http://localhost:3000/cinemas
curl http://localhost:3000/schedules
curl http://localhost:3000/comments
curl http://localhost:3000/blogs
```

## Kết quả

Sau khi seed xong, bạn sẽ có:
- ✅ 12 phim với poster và trailer
- ✅ 8 rạp chiếu ở 3 thành phố
- ✅ Hàng trăm lịch chiếu cho 7 ngày tới
- ✅ 30-60 bình luận cho các phim
- ✅ 6 bài blog về phim ảnh

Frontend sẽ hiển thị đầy đủ dữ liệu!

