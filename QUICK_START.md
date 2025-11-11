# Quick Start - Tạo Tables cho Database

## 🚀 Cách nhanh nhất (Development)

### Bước 1: Đảm bảo database đã được tạo

```bash
createdb movie_db
```

### Bước 2: Chạy ứng dụng

```bash
npm install
npm run start:dev
```

**✅ Xong!** TypeORM sẽ tự động tạo tất cả tables từ entities khi ứng dụng khởi động.

### Bước 3: Kiểm tra tables đã được tạo

```bash
# Kết nối vào database
psql movie_db

# Xem tất cả tables
\dt

# Xem cấu trúc một table
\d users
\d movies

# Thoát
\q
```

## 📋 Danh sách tables sẽ được tạo:

- ✅ `users` - Người dùng
- ✅ `movies` - Phim
- ✅ `cinemas` - Rạp chiếu
- ✅ `schedules` - Lịch chiếu
- ✅ `tickets` - Vé
- ✅ `comments` - Bình luận
- ✅ `blogs` - Blog

## 🔧 Cách hoạt động

File `src/config/database.config.ts` đã được cấu hình:

```typescript
synchronize: this.configService.get('NODE_ENV') === 'development',
```

Khi `NODE_ENV=development` (mặc định), TypeORM sẽ:
1. Đọc tất cả entities từ `src/*/entities/*.entity.ts`
2. So sánh với database hiện tại
3. Tự động tạo/cập nhật tables, indexes, foreign keys
4. Giữ nguyên data nếu có

## ⚠️ Lưu ý

- **Development**: Dùng `synchronize: true` (tự động) - OK ✅
- **Production**: Nên dùng migrations - Xem `MIGRATIONS_GUIDE.md`

## 🐛 Troubleshooting

### Lỗi: "relation already exists"
- Tables đã được tạo trước đó - Bình thường, không sao!

### Lỗi: "database does not exist"
```bash
createdb movie_db
```

### Lỗi: "password authentication failed"
- Kiểm tra lại thông tin trong file `.env`

### Muốn reset database (xóa và tạo lại)
```bash
# Xóa database
dropdb movie_db

# Tạo lại database
createdb movie_db

# Chạy ứng dụng (tự động tạo tables)
npm run start:dev
```

## 📚 Xem thêm

- `MIGRATIONS_GUIDE.md` - Hướng dẫn sử dụng migrations (production)
- `DATABASE_SETUP.md` - Hướng dẫn cấu hình database
- `README.md` - Tổng quan về project

