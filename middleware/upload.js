import fs from 'fs';
import multer from 'multer';
import path from 'path';

const createUploadMiddleware = (subfolder) => {
  const uploadDirectory = path.join('uploads', subfolder);

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
      recursive: true,
    });
  }

  // MULTER STORAGE
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  // FILE FILTER
  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed'), false);
    }
  };

  // MULTER CONFIG
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

export default createUploadMiddleware;