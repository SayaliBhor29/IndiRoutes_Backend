import path from "path";

export const normalizeUploadPath = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  const normalized = value.replace(/\\/g, "/");

  if (normalized.startsWith("uploads/")) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/")) {
    return normalized.slice(1);
  }

  const uploadIndex = normalized.indexOf("/uploads/");
  if (uploadIndex !== -1) {
    return normalized.slice(uploadIndex + 1);
  }

  return normalized;
};

export const getUploadedFilePath = (file) => {
  if (!file) {
    return "";
  }

  return normalizeUploadPath(file.path || path.join("uploads", file.filename));
};

export const normalizeImageFields = (documents) => {
  const normalizeOne = (document) => {
    const item = typeof document.toObject === "function" ? document.toObject() : { ...document };
    if (item.image) {
      item.image = normalizeUploadPath(item.image);
    }
    return item;
  };

  return Array.isArray(documents) ? documents.map(normalizeOne) : normalizeOne(documents);
};

export const getLocalUploadFilePath = (imagePath) => {
  const normalized = normalizeUploadPath(imagePath);

  if (!normalized || !normalized.startsWith("uploads/")) {
    return null;
  }

  return path.resolve(process.cwd(), normalized);
};
