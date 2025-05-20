const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require("./fileUtils");
const { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS } = require("../constants");

const imagesDir = path.join(__dirname, "..", "images");

async function convertToWebP(file) {
  const randomName =
    Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  const outputFilename = `${randomName}.webp`;
  const outputPath = path.join(imagesDir, outputFilename);

  await sharp(file.path).webp().toFile(outputPath);
  deleteFile(file.path);

  return outputFilename;
}

function isValidImage(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  return (
    ALLOWED_MIME_TYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(ext)
  );
}

module.exports = { convertToWebP, isValidImage };
