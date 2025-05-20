const path = require("path");

const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
  "image/avif",
  "image/heif",
  "image/heic",
];

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".tif",
  ".tiff",
  ".bmp",
  ".svg",
  ".avif",
  ".heif",
  ".heic",
];

const IMAGES_DIR = path.join(__dirname, "..", "images");

module.exports = {
  PORT,
  SERVER_URL,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  IMAGES_DIR,
};
