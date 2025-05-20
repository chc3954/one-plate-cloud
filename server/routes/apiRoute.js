const fs = require("fs");
const express = require("express");
const path = require("path");
const upload = require("../config/multerConfig");
const verifyApiKey = require("../middleware/verifyApiKey");
const { convertToWebP, isValidImage } = require("../utils/imageProcessors");
const { SERVER_URL } = require("../constants");

const router = express.Router();

const imagesDir = path.join(__dirname, "..", "images");

router.get("/list", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read images directory" });
    }

    // Filter out non-image files
    const imageFiles = files.filter((file) =>
      /\.(webp|jpg|jpeg|png|gif)$/i.test(file)
    );

    // Sort files by modification time (newest first)
    imageFiles.sort(
      (a, b) =>
        fs.statSync(path.join(imagesDir, b)).mtime -
        fs.statSync(path.join(imagesDir, a)).mtime
    );

    const total = imageFiles.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const paginatedFiles = imageFiles.slice(offset, offset + limit);

    const imageUrls = paginatedFiles.map((file) => ({
      filename: file,
      url: `${SERVER_URL}/images/${file}`,
    }));

    res.json({
      page,
      total,
      totalPages,
      images: imageUrls,
    });
  });
});

router.post(
  "/upload",
  verifyApiKey,
  upload.array("images", 10),
  async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "At least one file is required" });
    }

    const result = {
      success: [],
      failed: [],
    };

    for (const file of files) {
      if (!isValidImage(file)) {
        deleteFile(file.path);
        result.failed.push({
          original: file.originalname,
          error: "Unsupported file format",
        });
        continue;
      }

      try {
        const outputFilename = await convertToWebP(file);
        result.success.push({
          original: file.originalname,
          url: `${SERVER_URL}/images/${outputFilename}`,
        });
      } catch (err) {
        console.error("Error processing image:", file.originalname, err);
        deleteFile(file.path);
        result.failed.push({
          original: file.originalname,
          error: "Failed to process image",
        });
      }
    }

    return res.json(result);
  }
);

router.delete("/delete/:filename", verifyApiKey, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(imagesDir, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

module.exports = router;
