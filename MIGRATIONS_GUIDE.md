# Hướng dẫn tạo và quản lý Database Tables

## Có 2 cách tạo tables:

### 1. Tự động tạo tables (Development Mode) ⚡

**Cách đơn giản nhất - Không cần migrations**

Khi bạn chạy ứng dụng với `NODE_ENV=development`, TypeORM sẽ **tự động tạo tất cả tables** từ các entities.

#### Các bước:

1. **Đảm bảo file `.env` có:**
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_db
```

2. **Tạo database (nếu chưa có):**
```bash
createdb movie_db
# hoặc
psql postgres -c "CREATE DATABASE movie_db;"
```

3. **Chạy ứng dụng:**
```bash
npm run start:dev
```

4. **TypeORM sẽ tự động:**
   - Tạo tất cả tables từ entities
   - Tạo các indexes
   - Tạo foreign keys
   - Tạo relationships

#### Tables sẽ được tạo:
- ✅ `users` - Bảng người dùng
- ✅ `movies` - Bảng phim
- ✅ `cinemas` - Bảng rạp chiếu
- ✅ `schedules` - Bảng lịch chiếu
- ✅ `tickets` - Bảng vé
- ✅ `comments` - Bảng bình luận
- ✅ `blogs` - Bảng blog

### 2. Sử dụng Migrations (Production Mode) 🚀

**Cách chuyên nghiệp - Khuyến nghị cho production**

#### Tạo migration đầu tiên:

```bash
# Tạo migration từ entities hiện tại
npm run migration:generate -- src/migrations/InitialMigration
```

#### Chạy migrations:

```bash
# Chạy tất cả migrations chưa được áp dụng
npm run migration:run
```

#### Xem trạng thái migrations:

```bash
# Xem các migrations đã chạy
npm run migration:show
```

#### Revert migration:

```bash
# Hoàn tác migration cuối cùng
npm run migration:revert
```

#### Tạo migration trống (thủ công):

```bash
# Tạo file migration mới (trống)
npm run migration:create -- src/migrations/AddNewColumn
```

## Chi tiết các bước

### Bước 1: Development - Tự động tạo tables

File `src/config/database.config.ts` đã được cấu hình:

```typescript
synchronize: this.configService.get('NODE_ENV') === 'development',
```

Khi `NODE_ENV=development`, `synchronize: true` sẽ:
- Tự động tạo tables khi khởi động
- Tự động cập nhật schema khi entities thay đổi
- **Cảnh báo**: Không nên dùng trong production!

### Bước 2: Production - Sử dụng Migrations

1. **Tắt synchronize trong production:**

File `.env`:
```env
NODE_ENV=production
```

2. **Tạo migration đầu tiên:**

```bash
npm run migration:generate -- src/migrations/InitialMigration
```

File migration sẽ được tạo trong `src/migrations/` với tên như:
`1677123456789-InitialMigration.ts`

3. **Chỉnh sửa migration (nếu cần):**

Mở file migration và kiểm tra các thay đổi:
```typescript
export class InitialMigration1677123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo tables
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa tables (revert)
  }
}
```

4. **Chạy migration:**

```bash
npm run migration:run
```

5. **Kiểm tra kết quả:**

```bash
# Kết nối vào database
psql movie_db

# Xem các tables
\dt

# Xem cấu trúc table
\d users
\d movies
```

## Tạo migration cho thay đổi mới

Khi bạn thêm/sửa/xóa entities:

1. **Sửa entities** trong thư mục `src/*/entities/`

2. **Tạo migration mới:**
```bash
npm run migration:generate -- src/migrations/AddNewFeature
```

3. **Kiểm tra file migration** được tạo

4. **Chạy migration:**
```bash
npm run migration:run
```

## Các lệnh hữu ích

### Xem schema hiện tại:

```bash
npm run schema:sync
```

### Xóa tất cả tables (cẩn thận!):

```bash
npm run schema:drop
```

### Tạo migration từ thay đổi:

```bash
# Tự động generate migration từ sự khác biệt giữa entities và database
npm run migration:generate -- src/migrations/YourMigrationName
```

## Ví dụ Migration File

File `src/migrations/1677123456789-InitialMigration.ts`:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1677123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "phone" character varying,
        "role" character varying NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
    // ... các tables khác
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    // ... xóa các tables khác
  }
}
```

## Troubleshooting

### Lỗi: "relation already exists"

**Nguyên nhân**: Tables đã được tạo trước đó

**Giải pháp**:
- Xóa tables cũ: `npm run schema:drop` (cẩn thận!)
- Hoặc bỏ qua nếu đã có data

### Lỗi: "Cannot find module 'typeorm'"

**Nguyên nhân**: Chưa cài đặt dependencies

**Giải pháp**:
```bash
npm install
```

### Lỗi: Migration không chạy

**Nguyên nhân**: File data-source.ts chưa được cấu hình đúng

**Giải pháp**: Kiểm tra file `src/config/data-source.ts`

### Muốn reset database (Development)

```bash
# Xóa tất cả tables
npm run schema:drop

# Tự động tạo lại từ entities
npm run start:dev
```

## Khuyến nghị

### Development:
- ✅ Sử dụng `synchronize: true` (tự động)
- ✅ Nhanh chóng, dễ dàng
- ✅ Không cần migrations

### Production:
- ✅ Sử dụng migrations
- ✅ Kiểm soát được thay đổi
- ✅ Có thể rollback
- ✅ An toàn hơn

## Kiểm tra tables đã được tạo

Sau khi chạy ứng dụng, kiểm tra:

```bash
# Kết nối PostgreSQL
psql movie_db

# Xem tất cả tables
\dt

# Xem cấu trúc một table
\d users
\d movies
\d cinemas
\d schedules
\d tickets
\d comments
\d blogs

# Thoát
\q
```

## Tóm tắt nhanh

### Development (Tự động):
```bash
# 1. Tạo database
createdb movie_db

# 2. Chạy ứng dụng (tự động tạo tables)
npm run start:dev
```

### Production (Migrations):
```bash
# 1. Tạo database
createdb movie_db

# 2. Tạo migration
npm run migration:generate -- src/migrations/InitialMigration

# 3. Chạy migration
npm run migration:run

# 4. Chạy ứng dụng
npm run start:prod
```

