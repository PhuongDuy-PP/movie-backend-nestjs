# Quick Start - Seed Data Phim

## Đã seed thành công 12 phim vào database!

### Chạy seed data

```bash
npm run seed:movies
```

### Danh sách phim đã seed

#### Phim đang chiếu (11 phim):
1. **Dune: Part Two** (2024) - Sci-Fi - Rating: 8.7
2. **Oppenheimer** (2023) - Biography - Rating: 8.3
3. **The Batman** (2022) - Action - Rating: 7.8
4. **Spider-Man: Across the Spider-Verse** (2023) - Animation - Rating: 8.7
5. **Top Gun: Maverick** (2022) - Action - Rating: 8.2
6. **Avatar: The Way of Water** (2022) - Sci-Fi - Rating: 7.6
7. **Everything Everywhere All at Once** (2022) - Comedy - Rating: 8.1
8. **John Wick: Chapter 4** (2023) - Action - Rating: 7.7
9. **The Matrix Resurrections** (2021) - Sci-Fi - Rating: 5.7
10. **Interstellar** (2014) - Sci-Fi - Rating: 8.4
11. **Inception** (2010) - Sci-Fi - Rating: 8.8

#### Phim sắp chiếu (1 phim):
1. **Deadpool & Wolverine** (2024-07-26) - Action - Rating: 8.5

### Tính năng

✅ Tất cả phim đều có:
- Poster từ TMDB
- Trailer YouTube
- Rating
- Thông tin đầy đủ (director, actors, genre, duration)

### Frontend

Frontend sẽ tự động hiển thị:
- **Trang chủ**: Phim đang chiếu và sắp chiếu
- **Trang phim**: Danh sách với filter tabs
- **Chi tiết phim**: Click vào phim sẽ có modal trailer

### Test

1. **Kiểm tra API:**
```bash
curl http://localhost:3000/movies
```

2. **Kiểm tra phim đang chiếu:**
```bash
curl "http://localhost:3000/movies?status=now-showing"
```

3. **Kiểm tra phim sắp chiếu:**
```bash
curl "http://localhost:3000/movies?status=coming-soon"
```

4. **Xem trên frontend:**
- Mở `http://localhost:3001`
- Xem trang chủ có phim đang chiếu và sắp chiếu
- Click vào phim để xem chi tiết và trailer

### Seed lại

Nếu muốn seed lại từ đầu:

```sql
-- Xóa tất cả phim
DELETE FROM movies;
```

Sau đó chạy lại:
```bash
npm run seed:movies
```

## Lưu ý

- Script sẽ không seed lại nếu đã có phim trong database
- Tất cả poster và trailer đều từ TMDB và YouTube
- Phim được phân loại tự động dựa trên releaseDate

