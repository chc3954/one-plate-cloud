const express = require("express");
const path = require("path");
const sharp = require("sharp");

const upload = require("../config/multerConfig");
const verifyApiKey = require("../middleware/verifyApiKey");
const { deleteFile } = require("../utils/fileUtils");
const { convertToWebP, isValidImage } = require("../utils/imageProcessors");
const { SERVER_URL } = require("../constants");

const router = express.Router();

router.post("/", verifyApiKey, upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }

  if (!isValidImage(file)) {
    deleteFile(file.path);
    return res.status(400).json({ error: "Unsupported file format" });
  }

  try {
    const outputFilename = await convertToWebP(file);

    return res.json({
      success: true,
      url: `${SERVER_URL}/images/${outputFilename}`,
    });
  } catch (err) {
    console.error("Error processing image:", err);
    deleteFile(file.path);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;
