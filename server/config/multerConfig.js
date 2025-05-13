const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tmpDir = path.join(__dirname, "..", "images", "tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
  console.log("✅ Created 'images/tmp' directory");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure tmpDir exists before saving file
    fs.mkdir(tmpDir, { recursive: true }, (err) => {
      if (err) {
        console.error("❌ Failed to create tmp directory:", err);
        return cb(err);
      }
      cb(null, tmpDir);
    });
  },
  filename: (req, file, cb) => {
    const filename = `temp_${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = upload;
