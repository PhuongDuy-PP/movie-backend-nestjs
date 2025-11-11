# Quick Check - Server Status

## Kiểm tra server đang chạy

Sau khi chạy `npm run start:dev`, server sẽ:

1. **Compile TypeScript** - Có thể mất vài giây
2. **Kết nối database** - Kiểm tra PostgreSQL
3. **Khởi động server** - Chạy tại `http://localhost:3000`

## Expected Output

Khi server khởi động thành công, bạn sẽ thấy:

```
Application is running on: http://localhost:3000
Swagger documentation: http://localhost:3000/api
```

## Kiểm tra server

### 1. Test API endpoint

```bash
curl http://localhost:3000/movies
```

Nếu thành công, sẽ trả về danh sách phim (có thể là array rỗng `[]`).

### 2. Test Swagger

Mở trình duyệt và truy cập:
```
http://localhost:3000/api
```

### 3. Test upload endpoint (cần admin token)

```bash
# Đăng nhập để lấy token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Upload poster (thay <token> bằng token từ response trên)
curl -X POST \
  http://localhost:3000/movies/upload-poster \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/poster.jpg"
```

## Common Issues

### Server không khởi động

1. **Kiểm tra database:**
   ```bash
   psql -U postgres -c "SELECT 1;"
   ```

2. **Kiểm tra port:**
   ```bash
   lsof -i :3000
   ```

3. **Kiểm tra .env file:**
   ```bash
   cat .env
   ```

### Lỗi compilation

```bash
# Xóa và cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Lỗi database connection

Kiểm tra trong `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_db
```

## Next Steps

1. ✅ Server đang chạy
2. ✅ Test API endpoints
3. ✅ Upload hình ảnh
4. ✅ Tạo phim với poster
5. ✅ Test frontend integration

## Verify Image Upload

1. **Upload poster:**
   ```bash
   POST /movies/upload-poster
   ```

2. **Kiểm tra file đã được lưu:**
   ```bash
   ls -la uploads/posters/
   ```

3. **Kiểm tra file có thể truy cập:**
   ```
   http://localhost:3000/uploads/posters/{filename}
   ```

4. **Tạo phim với poster URL:**
   ```bash
   POST /movies
   {
     "title": "Test Movie",
     "description": "Test",
     "director": "Test Director",
     "actors": ["Actor 1"],
     "genre": "Action",
     "duration": 120,
     "releaseDate": "2024-01-01",
     "poster": "http://localhost:3000/uploads/posters/{filename}"
   }
   ```

## Status Check

- [ ] Server đang chạy
- [ ] Database connected
- [ ] API endpoints hoạt động
- [ ] Swagger UI accessible
- [ ] Upload endpoint hoạt động
- [ ] Static files được serve
- [ ] Frontend có thể kết nối

