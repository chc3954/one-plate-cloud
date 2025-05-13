const fs = require("fs");

function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) console.error("Failed to delete file:", path);
  });
}

module.exports = {
  deleteFile,
};
