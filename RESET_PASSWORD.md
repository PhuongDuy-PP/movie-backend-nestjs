# Hướng Dẫn Reset Password

## Tổng quan

Hệ thống hỗ trợ 2 API endpoints để reset password:
1. **Forgot Password** - Yêu cầu reset password
2. **Reset Password** - Đặt lại password mới với token

## API Endpoints

### 1. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a password reset link has been sent.",
  "resetToken": "abc123...", // Chỉ trong development
  "resetUrl": "http://localhost:3001/reset-password?token=abc123..." // Chỉ trong development
}
```

**Lưu ý:**
- API luôn trả về success message để bảo mật (không tiết lộ email có tồn tại hay không)
- Trong development, token và URL được trả về trong response
- Trong production, token sẽ được gửi qua email (cần cấu hình email service)

### 2. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired reset token

## Quy trình Reset Password

1. **User yêu cầu reset password:**
   ```bash
   curl -X POST http://localhost:3000/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com"
     }'
   ```

2. **Backend tạo reset token:**
   - Tạo token ngẫu nhiên (32 bytes, hex)
   - Hash token với SHA-256 và lưu vào database
   - Set expiration time (1 giờ)
   - Log token trong development (sẽ gửi email trong production)

3. **User nhận token:**
   - Trong development: Token được trả về trong response
   - Trong production: Token được gửi qua email

4. **User reset password:**
   ```bash
   curl -X POST http://localhost:3000/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{
       "token": "abc123...",
       "password": "newpassword123"
     }'
   ```

5. **Backend verify và reset:**
   - Verify token (hash và so sánh)
   - Kiểm tra token chưa hết hạn
   - Hash password mới
   - Update password và xóa reset token

## Database Schema

User entity có thêm 2 fields:
- `resetPasswordToken`: string (nullable) - Hashed reset token
- `resetPasswordExpires`: timestamp (nullable) - Token expiration time

## Security Features

1. **Token Security:**
   - Token được hash với SHA-256 trước khi lưu vào database
   - Token chỉ có hiệu lực trong 1 giờ
   - Token bị xóa sau khi reset password thành công

2. **Email Privacy:**
   - API không tiết lộ email có tồn tại hay không
   - Luôn trả về success message

3. **Password Security:**
   - Password được hash với bcrypt (10 rounds)
   - Password mới phải có tối thiểu 6 ký tự

## Migration

Cần chạy migration để thêm columns vào database:

```bash
npm run migration:generate -- AddResetPasswordFields
npm run migration:run
```

Hoặc nếu dùng synchronize (development only):
- Restart server, TypeORM sẽ tự động thêm columns

## Frontend Integration

### Forgot Password Page

```typescript
const handleForgotPassword = async (email: string) => {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    // Show success message
    // In development, show token in console or alert
    console.log('Reset token:', response.data.resetToken);
  } catch (error) {
    // Handle error
  }
};
```

### Reset Password Page

```typescript
const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    // Show success message and redirect to login
  } catch (error) {
    // Handle error (invalid/expired token)
  }
};
```

## Production Setup

### 1. Cấu hình Email Service

Thêm email service (ví dụ: Nodemailer, SendGrid, AWS SES):

```typescript
// src/common/services/email.service.ts
@Injectable()
export class EmailService {
  async sendPasswordResetEmail(email: string, resetUrl: string) {
    // Send email with reset link
    // Use Nodemailer, SendGrid, etc.
  }
}
```

### 2. Update AuthService

```typescript
// In forgotPassword method, replace console.log with:
await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
```

### 3. Environment Variables

```env
FRONTEND_URL=https://yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### 4. Remove Development Code

Xóa phần trả về token trong response:
```typescript
return {
  message: 'If the email exists, a password reset link has been sent.',
  // Remove this in production
};
```

## Testing

### Test Forgot Password

```bash
# 1. Request reset password
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# 2. Check console for token (development only)
# 3. Use token to reset password
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-from-step-2",
    "password": "newpassword123"
  }'

# 4. Try to login with new password
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "newpassword123"
  }'
```

### Test Error Cases

```bash
# Invalid token
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid-token",
    "password": "newpassword123"
  }'

# Expired token (wait 1 hour after creating token)
# Token sẽ hết hạn sau 1 giờ
```

## Troubleshooting

### Lỗi: "Invalid or expired reset token"
- Token không hợp lệ hoặc đã hết hạn
- Kiểm tra token có đúng không
- Kiểm tra token chưa quá 1 giờ

### Lỗi: Database column không tồn tại
- Chạy migration: `npm run migration:run`
- Hoặc restart server với synchronize: true (development only)

### Token không hoạt động
- Đảm bảo token chưa được sử dụng (token bị xóa sau khi reset thành công)
- Đảm bảo token chưa hết hạn (1 giờ)
- Kiểm tra token có đúng format không

## Best Practices

1. **Token Expiration:**
   - Set expiration time ngắn (1 giờ là hợp lý)
   - Xóa token sau khi sử dụng

2. **Email Security:**
   - Không tiết lộ email có tồn tại hay không
   - Sử dụng HTTPS cho reset link
   - Thêm rate limiting để tránh spam

3. **Password Requirements:**
   - Yêu cầu password mạnh (min 6-8 ký tự)
   - Không cho phép password cũ
   - Thêm password strength indicator

4. **Rate Limiting:**
   - Giới hạn số lần request reset password (ví dụ: 3 lần/giờ)
   - Giới hạn số lần reset password với cùng token

## Next Steps

1. ✅ Implement forgot password API
2. ✅ Implement reset password API
3. ⏳ Add email service (production)
4. ⏳ Add rate limiting
5. ⏳ Add frontend pages
6. ⏳ Add password strength validation
7. ⏳ Add logging và monitoring

