# Security Fix - Remove Password from API Responses

## Vấn đề

API đang trả về password field trong response, điều này rất nguy hiểm về mặt bảo mật.

## Giải pháp đã áp dụng

### 1. Thêm @Exclude() decorator vào User entity
- Password field được đánh dấu với `@Exclude()` từ `class-transformer`
- Tự động loại bỏ password khi serialize object

### 2. Enable ClassSerializerInterceptor
- Thêm `ClassSerializerInterceptor` vào `main.ts`
- Tự động exclude các fields được đánh dấu `@Exclude()` trong tất cả responses

### 3. Explicit field selection trong UserService
- `findOne()`: Chỉ select các fields cần thiết (không include password)
- `findAll()`: Chỉ select các fields cần thiết (không include password)
- `update()`: Loại bỏ password nếu có trong update data

### 4. Bảo vệ ở nhiều lớp
- **Layer 1**: Entity level - `@Exclude()` decorator
- **Layer 2**: Service level - Explicit field selection
- **Layer 3**: Interceptor level - `ClassSerializerInterceptor`

## Kết quả

### Trước khi fix:
```json
{
  "id": "692881d5-28fd-41ba-a0c5-b6905f268837",
  "email": "user@example.com",
  "password": "$2b$10$kf8.OGvRtIlXIch7T0KawO1qXp4GV4vaHpQx0Md7XZhTMOor2QFR.",
  "fullName": "John Doe",
  ...
}
```

### Sau khi fix:
```json
{
  "id": "692881d5-28fd-41ba-a0c5-b6905f268837",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "0123456789",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-11-10T07:56:00.291Z",
  "updatedAt": "2025-11-10T07:56:00.291Z"
}
```

## Các endpoints được bảo vệ

✅ `GET /users/:id` - Không trả về password
✅ `GET /users` - Không trả về password
✅ `PATCH /users/:id` - Không trả về password
✅ `POST /auth/register` - Không trả về password (đã có từ trước)
✅ `POST /auth/login` - Không trả về password (đã có từ trước)
✅ `GET /bookings` - User object trong relations không có password
✅ `GET /comments` - User object trong relations không có password
✅ `GET /blogs` - Author (User) object không có password

## Lưu ý

1. **Authentication vẫn hoạt động bình thường**
   - `findByEmail()` vẫn trả về password để verify (internal use only)
   - Password chỉ được sử dụng trong authentication flow
   - Không bao giờ được trả về trong API responses

2. **Relations cũng được bảo vệ**
   - Khi user được load qua relations (comments, bookings, blogs)
   - Password vẫn tự động bị loại bỏ nhờ `ClassSerializerInterceptor`

3. **Update password**
   - Nếu cần update password, nên tạo endpoint riêng với validation đặc biệt
   - Hiện tại `update()` method đã loại bỏ password nếu có trong update data

## Testing

Test lại API để verify:

```bash
# Get user by ID - Không có password
curl -X 'GET' \
  'http://localhost:3000/users/692881d5-28fd-41ba-a0c5-b6905f268837' \
  -H 'Authorization: Bearer <token>'

# Response sẽ không có password field
```

## Files đã thay đổi

1. `src/user/entities/user.entity.ts` - Thêm `@Exclude()` decorator
2. `src/user/user.service.ts` - Explicit field selection
3. `src/main.ts` - Thêm `ClassSerializerInterceptor`
4. `src/user/dto/user-response.dto.ts` - DTO mới (optional, for documentation)

