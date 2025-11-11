# Hướng dẫn tạo tài khoản Admin

Có 3 cách để tạo tài khoản Admin:

## Cách 1: Sử dụng Script (Khuyến nghị) ⚡

### Sử dụng script tự động:

```bash
# Tạo admin với thông tin mặc định
npm run create:admin

# Tạo admin với email và password tùy chỉnh
npm run create:admin admin@example.com mypassword123 "Admin Name"

# Chỉ định email
npm run create:admin admin@example.com

# Chỉ định email và password
npm run create:admin admin@example.com mypassword123

# Chỉ định email, password và full name
npm run create:admin admin@example.com mypassword123 "Admin Full Name"
```

### Ví dụ:

```bash
# Tạo admin mặc định
npm run create:admin
# Email: admin@example.com
# Password: admin123
# Full Name: Admin User

# Tạo admin tùy chỉnh
npm run create:admin admin@movie.com securepass123 "Movie Admin"
```

### Script sẽ:
- ✅ Tự động kết nối database
- ✅ Kiểm tra admin đã tồn tại chưa
- ✅ Tạo admin mới hoặc update user hiện tại thành admin
- ✅ Hash password tự động
- ✅ Hiển thị thông tin admin đã tạo

## Cách 2: Tạo user rồi update role trong Database

### Bước 1: Đăng ký user thông thường

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "fullName": "Admin User"
  }'
```

### Bước 2: Update role thành ADMIN trong database

```bash
# Kết nối PostgreSQL
psql movie_db

# Update role
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

# Kiểm tra
SELECT id, email, role FROM users WHERE email = 'admin@example.com';

# Thoát
\q
```

Hoặc sử dụng SQL trực tiếp:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Cách 3: Sử dụng API (Nếu có endpoint)

Nếu bạn đã tạo endpoint để update role (yêu cầu admin hiện tại):

```bash
# Login với admin hiện tại
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing-admin@example.com",
    "password": "password"
  }'

# Copy access_token từ response

# Update user thành admin
curl -X PATCH http://localhost:3000/users/{user-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "role": "admin"
  }'
```

## Kiểm tra Admin đã tạo

### Cách 1: Login và kiểm tra role

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response sẽ có:
```json
{
  "access_token": "...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin"  // ✅ Role là admin
  }
}
```

### Cách 2: Query database

```sql
SELECT id, email, role, "isActive" FROM users WHERE role = 'admin';
```

### Cách 3: Sử dụng API (yêu cầu admin token)

```bash
# Get all users (Admin only)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <admin_token>"
```

## Lưu ý bảo mật

1. **Đổi mật khẩu mặc định**
   - Sau khi tạo admin, nên đổi mật khẩu ngay
   - Không sử dụng mật khẩu mặc định trong production

2. **Bảo vệ admin account**
   - Chỉ tạo admin account khi cần thiết
   - Sử dụng email và password mạnh
   - Không chia sẻ thông tin admin

3. **Production**
   - Trong production, nên tạo admin thủ công hoặc qua script
   - Không để endpoint tạo admin công khai

## Troubleshooting

### Lỗi: "Admin already exists"
- Admin với email đó đã tồn tại
- Script sẽ không tạo duplicate
- Nếu muốn update, xóa user cũ hoặc update role trong database

### Lỗi: "Cannot connect to database"
- Kiểm tra file `.env` có đúng thông tin database không
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra database `movie_db` đã được tạo chưa

### Lỗi: "relation users does not exist"
- Tables chưa được tạo
- Chạy `npm run start:dev` để tạo tables trước
- Hoặc chạy migrations: `npm run migration:run`

## Quick Start

```bash
# 1. Đảm bảo database và tables đã được tạo
npm run start:dev  # Chạy một lần để tạo tables, sau đó Ctrl+C

# 2. Tạo admin
npm run create:admin admin@example.com securepassword123 "Admin Name"

# 3. Login và test
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

## Script Parameters

```bash
npm run create:admin [email] [password] [fullName]
```

- `email` (optional): Email của admin (default: `admin@example.com`)
- `password` (optional): Password của admin (default: `admin123`)
- `fullName` (optional): Tên đầy đủ (default: `Admin User`)

Ví dụ:
```bash
npm run create:admin
npm run create:admin admin@test.com
npm run create:admin admin@test.com mypass
npm run create:admin admin@test.com mypass "Test Admin"
```

