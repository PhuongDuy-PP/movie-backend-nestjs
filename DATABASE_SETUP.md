# Hướng dẫn cấu hình Database

## 1. Tạo file .env

Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_db

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 2. Giải thích các thông số

### Database Configuration

- **DB_HOST**: Địa chỉ máy chủ PostgreSQL (mặc định: `localhost`)
- **DB_PORT**: Cổng kết nối PostgreSQL (mặc định: `5432`)
- **DB_USERNAME**: Tên người dùng database (mặc định: `postgres`)
- **DB_PASSWORD**: Mật khẩu database (mặc định: `postgres`)
- **DB_DATABASE**: Tên database (mặc định: `movie_db`)

### JWT Configuration

- **JWT_SECRET**: Secret key để ký JWT token (nên đổi trong production)
- **JWT_EXPIRES_IN**: Thời gian hết hạn của token (mặc định: `7d`)

### Server Configuration

- **PORT**: Cổng chạy ứng dụng (mặc định: `3000`)
- **NODE_ENV**: Môi trường chạy (`development` hoặc `production`)

## 3. Cài đặt và cấu hình PostgreSQL

### Trên macOS (sử dụng Homebrew)

```bash
# Cài đặt PostgreSQL
brew install postgresql@14

# Khởi động PostgreSQL
brew services start postgresql@14

# Tạo database
createdb movie_db

# Hoặc sử dụng psql
psql postgres
CREATE DATABASE movie_db;
\q
```

### Trên Linux (Ubuntu/Debian)

```bash
# Cài đặt PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Khởi động PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Đăng nhập vào PostgreSQL
sudo -u postgres psql

# Tạo database
CREATE DATABASE movie_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE movie_db TO postgres;
\q
```

### Trên Windows

1. Tải và cài đặt PostgreSQL từ https://www.postgresql.org/download/windows/
2. Trong quá trình cài đặt, đặt mật khẩu cho user `postgres`
3. Mở pgAdmin hoặc Command Prompt
4. Tạo database:

```sql
CREATE DATABASE movie_db;
```

## 4. Cấu hình kết nối

### Cấu hình trong code

File `src/config/database.config.ts` đã được cấu hình để đọc thông tin từ file `.env`:

```typescript
{
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'movie_db',
  // ...
}
```

### Chế độ Development vs Production

- **Development**: `synchronize: true` - Tự động tạo/cập nhật schema khi khởi động
- **Production**: `synchronize: false` - Sử dụng migrations để quản lý schema

## 5. Kiểm tra kết nối

Sau khi cấu hình, chạy ứng dụng:

```bash
npm run start:dev
```

Nếu kết nối thành công, bạn sẽ thấy:
- Ứng dụng khởi động không có lỗi
- Database schema tự động được tạo (trong development mode)
- Có thể truy cập API tại `http://localhost:3000`

## 6. Troubleshooting

### Lỗi: "Connection refused"

**Nguyên nhân**: PostgreSQL chưa chạy hoặc sai thông tin kết nối

**Giải pháp**:
- Kiểm tra PostgreSQL đã khởi động: `brew services list` (macOS) hoặc `sudo systemctl status postgresql` (Linux)
- Kiểm tra thông tin trong file `.env`
- Kiểm tra firewall có chặn port 5432 không

### Lỗi: "database does not exist"

**Nguyên nhân**: Database chưa được tạo

**Giải pháp**:
```bash
createdb movie_db
# hoặc
psql postgres -c "CREATE DATABASE movie_db;"
```

### Lỗi: "password authentication failed"

**Nguyên nhân**: Sai mật khẩu hoặc username

**Giải pháp**:
- Kiểm tra lại mật khẩu trong file `.env`
- Đảm bảo user có quyền truy cập database

### Lỗi: "relation does not exist"

**Nguyên nhân**: Schema chưa được tạo

**Giải pháp**:
- Đảm bảo `NODE_ENV=development` trong file `.env` để tự động tạo schema
- Hoặc chạy migrations nếu trong production mode

## 7. Kết nối với database từ bên ngoài

Nếu bạn muốn kết nối từ ứng dụng khác hoặc từ máy khác:

### Cấu hình PostgreSQL để chấp nhận kết nối từ xa

1. Chỉnh sửa file `postgresql.conf`:
```conf
listen_addresses = '*'
```

2. Chỉnh sửa file `pg_hba.conf`:
```
host    all             all             0.0.0.0/0               md5
```

3. Restart PostgreSQL:
```bash
brew services restart postgresql@14  # macOS
sudo systemctl restart postgresql    # Linux
```

4. Cập nhật file `.env`:
```env
DB_HOST=your-server-ip
```

## 8. Sử dụng Docker (Tùy chọn)

Nếu bạn muốn sử dụng Docker để chạy PostgreSQL:

### Tạo file docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: movie_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Chạy Docker

```bash
docker-compose up -d
```

Sau đó cấu hình file `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_db
```

