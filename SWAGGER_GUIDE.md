# Swagger API Documentation Guide

## 🚀 Truy cập Swagger UI

Sau khi chạy ứng dụng, truy cập Swagger documentation tại:

**http://localhost:3000/api**

## 📋 Tính năng

### 1. API Documentation
- Tất cả endpoints được document tự động
- Mô tả chi tiết cho từng endpoint
- Request/Response examples
- Schema definitions

### 2. Authentication
- JWT Bearer Token authentication
- Nhấn nút **"Authorize"** ở trên cùng
- Nhập JWT token: `Bearer <your-token>`
- Token sẽ được lưu trong session

### 3. Test API
- Test trực tiếp các endpoints trong Swagger UI
- Xem request/response examples
- Validate request body

## 🔑 Cách sử dụng Authentication

### Bước 1: Đăng ký/Đăng nhập
1. Sử dụng endpoint `POST /auth/register` để đăng ký
2. Hoặc `POST /auth/login` để đăng nhập
3. Copy `access_token` từ response

### Bước 2: Authorize
1. Nhấn nút **"Authorize"** ở góc trên bên phải
2. Nhập: `Bearer <your-access-token>`
3. Nhấn **"Authorize"**
4. Đóng dialog

### Bước 3: Test Protected Endpoints
- Bây giờ bạn có thể test các endpoints yêu cầu authentication
- Token sẽ được tự động thêm vào header

## 📚 API Tags

- **auth** - Authentication endpoints
- **users** - User management
- **movies** - Movie management
- **cinemas** - Cinema management
- **schedules** - Schedule management
- **bookings** - Booking management
- **comments** - Comment management
- **blogs** - Blog management

## 🎯 Ví dụ sử dụng

### 1. Đăng ký user mới
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0123456789"
}
```

### 2. Đăng nhập
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Tạo phim mới (Admin)
```json
POST /movies
Authorization: Bearer <token>
{
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality",
  "director": "Lana Wachowski",
  "actors": ["Keanu Reeves", "Laurence Fishburne"],
  "genre": "Sci-Fi",
  "duration": 136,
  "releaseDate": "1999-03-31"
}
```

### 4. Đặt vé
```json
POST /bookings
Authorization: Bearer <token>
{
  "scheduleId": "schedule-id",
  "seats": ["A1", "A2"],
  "quantity": 2
}
```

## 🔧 Cấu hình

File `src/main.ts` đã được cấu hình với Swagger:

```typescript
const config = new DocumentBuilder()
  .setTitle('Movie Booking API')
  .setDescription('API documentation for Movie Booking System')
  .setVersion('1.0')
  .addBearerAuth(/* JWT config */)
  .build();
```

## 📝 Swagger Decorators

### Controllers
- `@ApiTags('tag-name')` - Nhóm endpoints
- `@ApiOperation({ summary: '...' })` - Mô tả endpoint
- `@ApiResponse({ status: 200, description: '...' })` - Response description
- `@ApiBearerAuth('JWT-auth')` - Yêu cầu JWT token
- `@ApiParam({ name: 'id' })` - Path parameter
- `@ApiQuery({ name: 'query' })` - Query parameter

### DTOs
- `@ApiProperty({ example: '...', description: '...' })` - Property description

## 🎨 Customization

Bạn có thể tùy chỉnh Swagger documentation bằng cách:

1. Thêm tags mới trong `main.ts`
2. Thêm examples vào DTOs
3. Thêm response schemas
4. Thêm security schemes

## 📖 Xem thêm

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

