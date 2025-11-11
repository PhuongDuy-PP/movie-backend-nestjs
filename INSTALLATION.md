# Hướng dẫn cài đặt

## Yêu cầu hệ thống

- Node.js v18 hoặc cao hơn
- PostgreSQL v12 hoặc cao hơn
- npm hoặc yarn

## Các bước cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

Tạo file `.env` trong thư mục gốc:

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

### 3. Tạo database PostgreSQL

Kết nối với PostgreSQL và chạy lệnh:

```sql
CREATE DATABASE movie_db;
```

Hoặc sử dụng psql:

```bash
psql -U postgres -c "CREATE DATABASE movie_db;"
```

### 4. Chạy ứng dụng

```bash
# Development mode (tự động sync database schema)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 5. Kiểm tra ứng dụng

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Tạo tài khoản Admin đầu tiên

Sau khi ứng dụng chạy, bạn có thể tạo tài khoản admin bằng cách:

1. Đăng ký tài khoản mới qua API:
```bash
POST http://localhost:3000/auth/register
{
  "email": "admin@example.com",
  "password": "admin123",
  "fullName": "Admin User"
}
```

2. Cập nhật role thành ADMIN trong database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## API Testing

Bạn có thể sử dụng Postman, Insomnia hoặc curl để test API. Ví dụ:

### Đăng ký
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Đăng nhập
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Lấy danh sách phim (không cần authentication)
```bash
curl http://localhost:3000/movies
```

### Đặt vé (cần authentication)
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scheduleId": "schedule-id",
    "seats": ["A1", "A2"],
    "quantity": 2
  }'
```

## Troubleshooting

### Lỗi kết nối database

- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin kết nối trong file `.env`
- Đảm bảo database `movie_db` đã được tạo

### Lỗi port đã được sử dụng

Thay đổi port trong file `.env`:
```env
PORT=3001
```

### Lỗi synchronize database

Trong môi trường development, `synchronize: true` sẽ tự động tạo/update schema.
Trong production, nên sử dụng migrations:
```bash
npm run migration:generate -- -n InitialMigration
npm run migration:run
```

