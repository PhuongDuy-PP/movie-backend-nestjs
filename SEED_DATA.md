# Hướng dẫn Seed Data Phim

## Tổng quan

Script seed data sẽ thêm 12 bộ phim vào database, bao gồm:
- Phim đang chiếu (releaseDate <= hôm nay)
- Phim sắp chiếu (releaseDate > hôm nay)

## Chạy Seed Data

```bash
npm run seed:movies
```

## Dữ liệu phim

Script sẽ thêm các phim sau:

### Phim đang chiếu:
1. **Dune: Part Two** - Sci-Fi (2024)
2. **Oppenheimer** - Biography (2023)
3. **The Batman** - Action (2022)
4. **Spider-Man: Across the Spider-Verse** - Animation (2023)
5. **Top Gun: Maverick** - Action (2022)
6. **Avatar: The Way of Water** - Sci-Fi (2022)
7. **Everything Everywhere All at Once** - Comedy (2022)
8. **John Wick: Chapter 4** - Action (2023)
9. **The Matrix Resurrections** - Sci-Fi (2021)
10. **Interstellar** - Sci-Fi (2014)
11. **Inception** - Sci-Fi (2010)

### Phim sắp chiếu:
1. **Deadpool & Wolverine** - Action (2024-07-26)

## Lưu ý

- Script sẽ kiểm tra nếu đã có phim trong database, sẽ không seed lại
- Tất cả phim đều có poster từ TMDB
- Tất cả phim đều có trailer YouTube
- Rating được set sẵn

## Xóa và seed lại

Nếu muốn seed lại từ đầu:

```sql
-- Xóa tất cả phim (cẩn thận!)
DELETE FROM movies;
```

Sau đó chạy lại:
```bash
npm run seed:movies
```

## Kiểm tra data

```sql
-- Xem tất cả phim
SELECT id, title, "releaseDate", rating FROM movies ORDER BY "releaseDate" DESC;

-- Xem phim đang chiếu
SELECT id, title, "releaseDate" FROM movies 
WHERE "releaseDate" <= CURRENT_DATE 
ORDER BY "releaseDate" DESC;

-- Xem phim sắp chiếu
SELECT id, title, "releaseDate" FROM movies 
WHERE "releaseDate" > CURRENT_DATE 
ORDER BY "releaseDate" ASC;
```

