// import fs from 'fs';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // __dirname fix for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure uploads folder exists at project root
// const uploadDir = path.join(__dirname, '../uploads');
// fs.mkdirSync(uploadDir, { recursive: true });

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, uploadDir);
//   },
//   filename: function(req, file, cb){
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 20 * 1024 * 1024}, // Max file size 20MB
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// });

// // Check File Type
// function checkFileType(file, cb){
//   const allowedExtensions = [
//     ".jpeg", ".jpg", ".png", ".gif", ".pdf", ".ppt", ".pptx", ".xls", ".xlsx", ".csv",
//   ];
//   const allowedMimeTypes = [
//     "image/jpeg", "image/png", "image/gif", "application/pdf",
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "text/csv", "application/csv",
//   ];
//   const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedMimeTypes.includes(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb(new Error("Only image, PDF, PowerPoint, Excel, and CSV files are allowed."));
//   }
// }

// export default upload;


import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


// =====================================================
// __dirname FIX FOR ES MODULES
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// =====================================================
// UPLOAD DIRECTORY
// =====================================================

// If this upload.js is inside:
// project/middleware/upload.js
//
// then ../uploads = project/uploads

const uploadDir = path.join(__dirname, "../uploads");


// Create uploads directory if not exists
fs.mkdirSync(uploadDir, {
  recursive: true,
});


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },


  filename: function (req, file, cb) {

    const extension = path.extname(
      file.originalname
    ).toLowerCase();

    const filename =
      file.fieldname +
      "-" +
      Date.now() +
      extension;

    cb(null, filename);
  },

});


// =====================================================
// FILE TYPE CHECK
// =====================================================

function checkFileType(file, cb) {

  const allowedExtensions = [

    ".jpeg",
    ".jpg",
    ".png",
    ".gif",

    ".pdf",

    ".ppt",
    ".pptx",

    ".xls",
    ".xlsx",

    ".csv",

  ];


  const allowedMimeTypes = [

    "image/jpeg",
    "image/png",
    "image/gif",

    "application/pdf",

    "application/vnd.ms-powerpoint",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/csv",

    "application/csv",

  ];


  const extension = path
    .extname(file.originalname)
    .toLowerCase();


  const extname =
    allowedExtensions.includes(extension);


  const mimetype =
    allowedMimeTypes.includes(file.mimetype);


  if (extname && mimetype) {

    return cb(null, true);

  }


  return cb(
    new Error(
      "Only image, PDF, PowerPoint, Excel, and CSV files are allowed."
    )
  );

}


// =====================================================
// MULTER UPLOAD
// =====================================================

const upload = multer({

  storage: storage,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },

  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },

});


export default upload;