# UUID Validation Fix

## Vấn đề

Khi gọi API với ID không phải UUID format (ví dụ: `/users/1`), hệ thống sẽ gặp lỗi:
```
QueryFailedError: invalid input syntax for type uuid: "1"
```

## Giải pháp

Đã thêm `ParseUUIDPipe` vào tất cả các controllers để validate UUID format trước khi xử lý request.

### Controllers đã được cập nhật:

1. **UserController** - `/users/:id`
2. **MovieController** - `/movies/:id`
3. **CinemaController** - `/cinemas/:id`
4. **ScheduleController** - `/schedules/:id`
5. **BookingController** - `/bookings/:id`, `/bookings/:id/cancel`
6. **CommentController** - `/comments/:id`
7. **BlogController** - `/blogs/:id`

### Cách hoạt động

Khi gọi API với ID không hợp lệ:
```bash
curl -X 'GET' 'http://localhost:3000/users/1' -H 'Authorization: Bearer <token>'
```

Hệ thống sẽ trả về lỗi 400 Bad Request với message rõ ràng:
```json
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request"
}
```

### Ví dụ sử dụng đúng

```bash
# Lấy user với UUID hợp lệ
curl -X 'GET' \
  'http://localhost:3000/users/692881d5-28fd-41ba-a0c5-b6905f268837' \
  -H 'Authorization: Bearer <token>'
```

### UUID Format

UUID phải có format:
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Ví dụ:
- ✅ `692881d5-28fd-41ba-a0c5-b6905f268837` - Valid
- ❌ `1` - Invalid
- ❌ `123` - Invalid
- ❌ `user-1` - Invalid

### Lấy UUID từ database

Để lấy UUID của user hoặc entity, bạn có thể:

1. **Từ response khi tạo mới:**
```bash
POST /auth/register
# Response sẽ chứa user id
```

2. **Từ danh sách:**
```bash
GET /users  # Admin only
GET /movies
GET /cinemas
# Response sẽ chứa danh sách với các UUID
```

3. **Từ database:**
```sql
SELECT id FROM users LIMIT 1;
```

### Testing

Sau khi fix, test lại:

```bash
# Test với UUID hợp lệ (sẽ thành công hoặc trả về 404 nếu không tìm thấy)
curl -X 'GET' \
  'http://localhost:3000/users/692881d5-28fd-41ba-a0c5-b6905f268837' \
  -H 'Authorization: Bearer <token>'

# Test với UUID không hợp lệ (sẽ trả về 400)
curl -X 'GET' \
  'http://localhost:3000/users/1' \
  -H 'Authorization: Bearer <token>'
```

## Lưu ý

- Tất cả ID parameters đều được validate tự động
- Query parameters (như `movieId`, `cinemaId`) vẫn là optional và sẽ được validate trong service nếu cần
- Swagger documentation đã được cập nhật để hiển thị rằng ID phải là UUID format

