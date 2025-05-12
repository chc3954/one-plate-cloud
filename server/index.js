const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "your_api_key_here";

app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

function verifyApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];

  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

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

// Set up multer storage (temporary storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images", "tmp"));
  },
  filename: (req, file, cb) => {
    const filename = `temp_${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", verifyApiKey, upload.single("image"), async (req, res) => {
  const file = req.file;
  const desiredFilename = req.body.filename;

  if (!file || !desiredFilename) {
    return res
      .status(400)
      .json({ error: "Both file and filename are required" });
  }

  const originalExt = path.extname(file.originalname).toLowerCase();

  if (
    !allowedExtensions.includes(originalExt) ||
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    fs.unlink(file.path, () => {});
    return res.status(400).json({ error: "Unsupported file format" });
  }

  const sanitizedFilename =
    path.basename(desiredFilename).replace(/[^a-zA-Z0-9_.-]/g, "") + ".webp";
  const outputPath = path.join(__dirname, "images", sanitizedFilename);

  try {
    await sharp(file.path).webp().toFile(outputPath);

    fs.unlink(file.path, () => {});

    return res.json({
      success: true,
      url: `https://oneplate-cloud.duckdns.org/images/${sanitizedFilename}`,
    });
  } catch (err) {
    console.error("Error converting image to WebP:", err);
    fs.unlink(file.path, () => {});
    return res.status(500).json({ error: "Failed to process image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
