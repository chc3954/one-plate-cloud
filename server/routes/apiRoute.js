const fs = require("fs");
const express = require("express");
const path = require("path");
const verifyApiKey = require("../middleware/verifyApiKey");

const router = express.Router();

const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
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
