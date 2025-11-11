# Hướng dẫn Upload Hình ảnh Phim

## Tổng quan

Backend đã được cấu hình để hỗ trợ upload hình ảnh poster cho phim. Hình ảnh được lưu trong thư mục `uploads/posters/` và được serve qua endpoint `/uploads/posters/`.

## Cấu hình

### 1. Thư mục uploads

Hình ảnh được lưu tại:
```
uploads/posters/
```

### 2. Environment Variables

Thêm vào file `.env`:
```env
BASE_URL=http://localhost:3000
```

Trong production, đặt `BASE_URL` thành domain của bạn:
```env
BASE_URL=https://api.yourdomain.com
```

## API Endpoints

### 1. Upload Poster (Tạo mới)

**Endpoint:** `POST /movies/upload-poster`

**Headers:**
- `Authorization: Bearer <token>` (Admin only)
- `Content-Type: multipart/form-data`

**Body:**
- `file`: File ảnh (jpg, jpeg, png, gif, webp)
- Max size: 5MB

**Response:**
```json
{
  "message": "Poster uploaded successfully",
  "filename": "movie-uuid.jpg",
  "originalName": "poster.jpg",
  "path": "/uploads/posters/movie-uuid.jpg",
  "url": "http://localhost:3000/uploads/posters/movie-uuid.jpg",
  "size": 123456
}
```

**Example (cURL):**
```bash
curl -X POST \
  http://localhost:3000/movies/upload-poster \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/poster.jpg"
```

### 2. Upload và Update Poster cho Phim

**Endpoint:** `POST /movies/:id/poster`

**Headers:**
- `Authorization: Bearer <token>` (Admin only)
- `Content-Type: multipart/form-data`

**Parameters:**
- `id`: Movie ID (UUID)

**Body:**
- `file`: File ảnh (jpg, jpeg, png, gif, webp)
- Max size: 5MB

**Response:**
```json
{
  "message": "Poster updated successfully",
  "filename": "movie-uuid.jpg",
  "originalName": "poster.jpg",
  "path": "/uploads/posters/movie-uuid.jpg",
  "url": "http://localhost:3000/uploads/posters/movie-uuid.jpg",
  "size": 123456
}
```

**Example (cURL):**
```bash
curl -X POST \
  http://localhost:3000/movies/{movie-id}/poster \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/poster.jpg"
```

### 3. Tạo Phim với Poster URL

**Endpoint:** `POST /movies`

**Body:**
```json
{
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality",
  "director": "Lana Wachowski",
  "actors": ["Keanu Reeves", "Laurence Fishburne"],
  "genre": "Sci-Fi",
  "duration": 136,
  "releaseDate": "1999-03-31",
  "poster": "http://localhost:3000/uploads/posters/movie-uuid.jpg",
  "trailer": "https://www.youtube.com/watch?v=vKQi3bBA1y8"
}
```

## Quy trình sử dụng

### Cách 1: Upload poster trước, sau đó tạo phim

1. **Upload poster:**
```bash
POST /movies/upload-poster
# Response: { "url": "http://localhost:3000/uploads/posters/movie-uuid.jpg" }
```

2. **Tạo phim với poster URL:**
```bash
POST /movies
{
  ...movieData,
  "poster": "http://localhost:3000/uploads/posters/movie-uuid.jpg"
}
```

### Cách 2: Tạo phim trước, sau đó upload poster

1. **Tạo phim:**
```bash
POST /movies
{
  ...movieData
  // poster: null hoặc không có
}
```

2. **Upload poster cho phim:**
```bash
POST /movies/{movie-id}/poster
# Tự động update poster URL trong database
```

## Giới hạn

- **Định dạng file:** jpg, jpeg, png, gif, webp
- **Kích thước tối đa:** 5MB
- **Quyền truy cập:** Chỉ Admin

## Xử lý lỗi

### Lỗi: "No file uploaded"
- Kiểm tra field name phải là `file`
- Kiểm tra request có đúng `multipart/form-data`

### Lỗi: "Only image files are allowed!"
- File không phải định dạng ảnh
- Kiểm tra extension file

### Lỗi: "File too large"
- File vượt quá 5MB
- Nén ảnh trước khi upload

## Frontend Integration

### Upload từ Frontend

```typescript
const uploadPoster = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3000/movies/upload-poster', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.url; // URL của poster
};
```

### Sử dụng trong React

```tsx
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      'http://localhost:3000/movies/upload-poster',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Poster URL:', response.data.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Production

### Lưu ý

1. **Storage:** Trong production, nên sử dụng cloud storage (AWS S3, Google Cloud Storage, etc.)
2. **CDN:** Sử dụng CDN để serve static files
3. **Backup:** Backup thư mục uploads định kỳ
4. **Security:** Validate file content, không chỉ dựa vào extension
5. **Optimization:** Resize và optimize images khi upload

### Sử dụng Cloud Storage

Có thể tích hợp với AWS S3:

```typescript
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Upload to S3
const uploadToS3 = async (file: Express.Multer.File) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `posters/${file.filename}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3.upload(params).promise();
  return result.Location; // S3 URL
};
```

## Troubleshooting

### Lỗi: "Cannot find module 'multer'"
```bash
npm install multer @types/multer
```

### Lỗi: "Cannot find module 'uuid'"
```bash
npm install uuid @types/uuid
```

### Lỗi: "ENOENT: no such file or directory"
- Tạo thư mục `uploads/posters/`:
```bash
mkdir -p uploads/posters
```

### Hình ảnh không hiển thị
- Kiểm tra `BASE_URL` trong `.env`
- Kiểm tra static files được serve đúng path
- Kiểm tra CORS configuration
- Kiểm tra file permissions

## Testing

### Test với Swagger

1. Truy cập `http://localhost:3000/api`
2. Đăng nhập với admin account
3. Tìm endpoint `POST /movies/upload-poster`
4. Click "Try it out"
5. Upload file
6. Xem response

### Test với Postman

1. Tạo request `POST http://localhost:3000/movies/upload-poster`
2. Headers: `Authorization: Bearer <token>`
3. Body: form-data
4. Key: `file`, Type: File
5. Chọn file và send

