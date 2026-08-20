// import path from "path";

// export const normalizeUploadPath = (value) => {
//   if (!value || typeof value !== "string") {
//     return value;
//   }

//   const normalized = value.replace(/\\/g, "/");

//   if (normalized.startsWith("uploads/")) {
//     return normalized;
//   }

//   if (normalized.startsWith("/uploads/")) {
//     return normalized.slice(1);
//   }

//   const uploadIndex = normalized.indexOf("/uploads/");
//   if (uploadIndex !== -1) {
//     return normalized.slice(uploadIndex + 1);
//   }

//   return normalized;
// };

// // export const getUploadedFilePath = (file) => {
// //   if (!file) {
// //     return "";
// //   }

// //   return normalizeUploadPath(file.path || path.join("uploads", file.filename));
// // };


// export const getUploadedFilePath = (file) => {
//   if (!file) {
//     return "";
//   }

//   if (file.filename) {
//     return `uploads/${file.filename}`;
//   }

//   return normalizeUploadPath(file.path);
// };
// export const normalizeImageFields = (documents) => {
//   const normalizeOne = (document) => {
//     const item = typeof document.toObject === "function" ? document.toObject() : { ...document };
//     if (item.image) {
//       item.image = normalizeUploadPath(item.image);
//     }
//     return item;
//   };

//   return Array.isArray(documents) ? documents.map(normalizeOne) : normalizeOne(documents);
// };

// export const getLocalUploadFilePath = (imagePath) => {
//   const normalized = normalizeUploadPath(imagePath);

//   if (!normalized || !normalized.startsWith("uploads/")) {
//     return null;
//   }

//   return path.resolve(process.cwd(), normalized);
// };


import path from "path";

/**
 * Normalize upload path
 *
 * Examples:
 * image.png
 * /image.png
 * uploads/image.png
 * /uploads/image.png
 * C:/project/uploads/image.png
 *
 * Result:
 * uploads/image.png
 */
export const normalizeUploadPath = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  const normalized = value.replace(/\\/g, "/");

  // Already correct
  if (normalized.startsWith("uploads/")) {
    return normalized;
  }

  // /uploads/file.png
  if (normalized.startsWith("/uploads/")) {
    return normalized.slice(1);
  }

  // Any path containing /uploads/
  const uploadIndex = normalized.indexOf("/uploads/");

  if (uploadIndex !== -1) {
    return normalized.slice(uploadIndex + 1);
  }

  // Only filename
  // image.png -> uploads/image.png
  if (!normalized.includes("/")) {
    return `uploads/${normalized}`;
  }

  return normalized;
};


/**
 * Get uploaded file path from multer file
 */
export const getUploadedFilePath = (file) => {
  if (!file) {
    return "";
  }

  // multer diskStorage
  if (file.filename) {
    return `uploads/${file.filename}`;
  }

  // fallback
  if (file.path) {
    return normalizeUploadPath(file.path);
  }

  return "";
};


/**
 * Normalize image field(s)
 */
export const normalizeImageFields = (documents) => {
  const normalizeOne = (document) => {
    if (!document) {
      return document;
    }

    const item =
      typeof document.toObject === "function"
        ? document.toObject()
        : { ...document };

    if (item.image) {
      item.image = normalizeUploadPath(item.image);
    }

    return item;
  };

  if (Array.isArray(documents)) {
    return documents.map(normalizeOne);
  }

  return normalizeOne(documents);
};


/**
 * Convert upload relative path
 * to absolute local filesystem path
 */
export const getLocalUploadFilePath = (imagePath) => {
  const normalized = normalizeUploadPath(imagePath);

  if (!normalized) {
    return null;
  }

  if (!normalized.startsWith("uploads/")) {
    return null;
  }

  return path.resolve(process.cwd(), normalized);
};