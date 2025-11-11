# Movie Booking Backend - NestJS

Ứng dụng backend cho hệ thống đặt vé xem phim được xây dựng với NestJS và PostgreSQL.

## Tính năng

- ✅ **Authentication**: Đăng ký, đăng nhập với JWT
- ✅ **Authorization**: Phân quyền Admin/User với Role-based Access Control
- ✅ **Quản lý phim**: CRUD phim, xem danh sách phim
- ✅ **Lịch chiếu**: Quản lý lịch chiếu phim theo rạp
- ✅ **Đặt vé**: Đặt vé, xem lịch sử đặt vé, hủy vé
- ✅ **Comment**: Bình luận và đánh giá phim
- ✅ **Blog**: Quản lý bài viết blog

## Công nghệ sử dụng

- **NestJS**: Framework Node.js
- **PostgreSQL**: Database
- **TypeORM**: ORM cho database
- **JWT**: Authentication
- **Passport**: Authentication strategies
- **bcrypt**: Mã hóa mật khẩu
- **class-validator**: Validation DTOs

## Cài đặt

### Yêu cầu

- Node.js (v18 trở lên)
- PostgreSQL (v12 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository và cài đặt dependencies:**

```bash
npm install
```

2. **Tạo file `.env` từ `.env.example`:**

```bash
cp .env.example .env
```

3. **Cấu hình database trong file `.env`:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_db

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

4. **Tạo database PostgreSQL:**

```sql
CREATE DATABASE movie_db;
```

5. **Chạy ứng dụng:**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập

### Movies

- `GET /movies` - Lấy danh sách phim
- `GET /movies/:id` - Lấy thông tin phim
- `POST /movies` - Tạo phim mới (Admin only)
- `PATCH /movies/:id` - Cập nhật phim (Admin only)
- `DELETE /movies/:id` - Xóa phim (Admin only)

### Cinemas

- `GET /cinemas` - Lấy danh sách rạp
- `GET /cinemas/:id` - Lấy thông tin rạp
- `POST /cinemas` - Tạo rạp mới (Admin only)
- `PATCH /cinemas/:id` - Cập nhật rạp (Admin only)
- `DELETE /cinemas/:id` - Xóa rạp (Admin only)

### Schedules

- `GET /schedules` - Lấy danh sách lịch chiếu
- `GET /schedules?movieId=:id` - Lấy lịch chiếu theo phim
- `GET /schedules?cinemaId=:id` - Lấy lịch chiếu theo rạp
- `GET /schedules/:id` - Lấy thông tin lịch chiếu
- `POST /schedules` - Tạo lịch chiếu mới (Admin only)
- `PATCH /schedules/:id` - Cập nhật lịch chiếu (Admin only)
- `DELETE /schedules/:id` - Xóa lịch chiếu (Admin only)

### Bookings

- `POST /bookings` - Đặt vé (Authenticated)
- `GET /bookings` - Lấy danh sách đặt vé của user
- `GET /bookings/:id` - Lấy thông tin đặt vé
- `POST /bookings/:id/cancel` - Hủy vé (Authenticated)
- `DELETE /bookings/:id` - Xóa đặt vé (Admin only)

### Comments

- `POST /comments` - Tạo bình luận (Authenticated)
- `GET /comments` - Lấy danh sách bình luận
- `GET /comments?movieId=:id` - Lấy bình luận theo phim
- `GET /comments/:id` - Lấy thông tin bình luận
- `PATCH /comments/:id` - Cập nhật bình luận (Owner or Admin)
- `DELETE /comments/:id` - Xóa bình luận (Owner or Admin)

### Blogs

- `POST /blogs` - Tạo bài viết (Authenticated)
- `GET /blogs` - Lấy danh sách bài viết
- `GET /blogs?published=true` - Lấy bài viết đã publish
- `GET /blogs/:id` - Lấy thông tin bài viết
- `PATCH /blogs/:id` - Cập nhật bài viết (Owner or Admin)
- `DELETE /blogs/:id` - Xóa bài viết (Owner or Admin)

### Users

- `GET /users` - Lấy danh sách users (Admin only)
- `GET /users/:id` - Lấy thông tin user
- `PATCH /users/:id` - Cập nhật user (Admin only)
- `DELETE /users/:id` - Xóa user (Admin only)

## Authentication

Sử dụng JWT Bearer token trong header:

```
Authorization: Bearer <token>
```

## Roles

- **ADMIN**: Quyền quản trị, có thể quản lý tất cả tài nguyên
- **USER**: Người dùng thông thường, có thể đặt vé, comment, viết blog

## Database Schema

### Users
- id (UUID)
- email (unique)
- password (hashed)
- fullName
- phone
- role (ADMIN/USER)
- isActive

### Movies
- id (UUID)
- title
- description
- director
- actors (array)
- genre
- duration
- releaseDate
- poster
- trailer
- rating
- isActive

### Cinemas
- id (UUID)
- name
- address
- city
- phone
- totalRooms
- isActive

### Schedules
- id (UUID)
- movieId
- cinemaId
- room
- showTime
- price
- totalSeats
- availableSeats
- isActive

### Tickets
- id (UUID)
- userId
- scheduleId
- seats (array)
- quantity
- totalPrice
- status (PENDING/CONFIRMED/CANCELLED)

### Comments
- id (UUID)
- userId
- movieId
- content
- rating (1-5)
- isActive

### Blogs
- id (UUID)
- title
- content
- image
- excerpt
- authorId
- isPublished
- views

## Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT

