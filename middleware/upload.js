import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists at project root
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, uploadDir);
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 20 * 1024 * 1024}, // Max file size 20MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// Check File Type
function checkFileType(file, cb){
  const allowedExtensions = [
    ".jpeg", ".jpg", ".png", ".gif", ".pdf", ".ppt", ".pptx", ".xls", ".xlsx", ".csv",
  ];
  const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/gif", "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv", "application/csv",
  ];
  const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb(new Error("Only image, PDF, PowerPoint, Excel, and CSV files are allowed."));
  }
}

export default upload;
