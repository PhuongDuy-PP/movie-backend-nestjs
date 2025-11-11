# Troubleshooting Guide

## Server không khởi động

### 1. Kiểm tra dependencies

```bash
npm install
```

### 2. Kiểm tra thư mục uploads

Đảm bảo thư mục `uploads/posters/` tồn tại:

```bash
mkdir -p uploads/posters
```

### 3. Kiểm tra file .env

Đảm bảo file `.env` có đầy đủ các biến:

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
BASE_URL=http://localhost:3000
```

### 4. Kiểm tra database connection

Đảm bảo PostgreSQL đang chạy và database đã được tạo:

```bash
# Kiểm tra PostgreSQL
psql -U postgres -c "SELECT version();"

# Kiểm tra database
psql -U postgres -c "\l" | grep movie_db
```

### 5. Kiểm tra lỗi TypeScript

```bash
npm run build
```

### 6. Kiểm tra port

Đảm bảo port 3000 không bị chiếm:

```bash
lsof -i :3000
```

Nếu port bị chiếm, thay đổi PORT trong `.env`:

```env
PORT=3001
```

## Lỗi upload hình ảnh

### Lỗi: "Cannot find module 'multer'"

```bash
npm install multer @types/multer
```

### Lỗi: "ENOENT: no such file or directory"

Tạo thư mục uploads:

```bash
mkdir -p uploads/posters
```

### Lỗi: "Only image files are allowed!"

- Kiểm tra file có đúng định dạng: jpg, jpeg, png, gif, webp
- Kiểm tra extension file (không phải chỉ đổi tên)

### Lỗi: "File too large"

- File vượt quá 5MB
- Nén ảnh trước khi upload
- Hoặc tăng limit trong `file-upload.interceptor.ts`:

```typescript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB
}
```

### Hình ảnh không hiển thị

1. Kiểm tra `BASE_URL` trong `.env`
2. Kiểm tra file có tồn tại trong `uploads/posters/`
3. Kiểm tra static files được serve đúng path
4. Kiểm tra CORS configuration

## Lỗi authentication

### Lỗi: "Unauthorized"

- Kiểm tra token trong request header
- Kiểm tra token chưa hết hạn
- Đăng nhập lại để lấy token mới

### Lỗi: "Forbidden - Admin only"

- Endpoint yêu cầu quyền Admin
- Kiểm tra role của user trong database
- Tạo admin account: `npm run create:admin`

## Lỗi database

### Lỗi: "relation does not exist"

Tables chưa được tạo:

```bash
# Development: tự động tạo tables
npm run start:dev

# Hoặc chạy migrations
npm run migration:run
```

### Lỗi: "password authentication failed"

Kiểm tra thông tin database trong `.env`:

```env
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Lỗi: "database does not exist"

Tạo database:

```bash
createdb movie_db
# hoặc
psql -U postgres -c "CREATE DATABASE movie_db;"
```

## Lỗi CORS

Nếu frontend không kết nối được với backend:

1. Kiểm tra CORS trong `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

2. Hoặc cho phép tất cả origins (chỉ development):

```typescript
app.enableCors();
```

## Logs và Debug

### Xem logs chi tiết

```bash
npm run start:dev
```

### Debug mode

```bash
npm run start:debug
```

### Xem database queries

Trong `database.config.ts`, set:

```typescript
logging: true,
```

## Common Issues

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
npm run build
```

### Port already in use

Thay đổi PORT trong `.env` hoặc kill process:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Test API

### Test với Swagger

1. Truy cập `http://localhost:3000/api`
2. Đăng nhập với admin account
3. Test các endpoints

### Test với cURL

```bash
# Test upload
curl -X POST \
  http://localhost:3000/movies/upload-poster \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/poster.jpg"

# Test get movies
curl http://localhost:3000/movies
```

## Contact

Nếu vẫn gặp vấn đề, kiểm tra:
1. Node.js version (>= 18)
2. PostgreSQL version (>= 12)
3. Tất cả dependencies đã được cài đặt
4. Environment variables đã được set
5. Database đã được tạo và kết nối thành công

