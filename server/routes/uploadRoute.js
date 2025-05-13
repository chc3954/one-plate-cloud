const express = require("express");
const path = require("path");
const sharp = require("sharp");

const upload = require("../config/multerConfig");
const verifyApiKey = require("../middleware/verifyApiKey");
const { deleteFile } = require("../utils/fileUtils");

const router = express.Router();

const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

const allowedMimeTypes = [
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

const allowedExtensions = [
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

const imagesDir = path.join(__dirname, "..", "images");

router.post("/", verifyApiKey, upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    !allowedExtensions.includes(ext) ||
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    deleteFile(file.path);
    return res.status(400).json({ error: "Unsupported file format" });
  }

  const randomName =
    Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  const outputFilename = `${randomName}.webp`;
  const outputPath = path.join(imagesDir, outputFilename);

  try {
    await sharp(file.path).webp().toFile(outputPath);
    deleteFile(file.path);

    return res.json({
      success: true,
      url: `${SERVER_URL}/images/${outputFilename}`,
    });
  } catch (err) {
    console.error("Error converting image to WebP:", err);
    deleteFile(file.path);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;
