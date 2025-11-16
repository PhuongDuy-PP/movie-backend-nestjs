import * as multer from 'multer';
import { extname } from 'path';
import * as crypto from 'crypto';
import { existsSync, mkdirSync } from 'fs';

// Đảm bảo thư mục avatars tồn tại
const avatarsDir = 'uploads/avatars';
if (!existsSync(avatarsDir)) {
  mkdirSync(avatarsDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const avatarFileFilter = (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    cb(new Error('Only image files are allowed!'), false);
    return;
  }
  cb(null, true);
};

export const avatarMulterOptions: multer.Options = {
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB (nhỏ hơn poster)
  },
};

