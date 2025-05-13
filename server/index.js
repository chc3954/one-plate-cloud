require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoute = require("./routes/uploadRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/upload", uploadRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
