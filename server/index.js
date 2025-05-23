require("dotenv").config();

const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const uploadRoute = require("./routes/uploadRoute");
const apiRoute = require("./routes/apiRoute");
const { PORT } = require("./constants");

const app = express();
const imagesDir = path.join(__dirname, "images");

app.use(cors());

app.use("/images", express.static(imagesDir));
app.use("/api", apiRoute);
app.use("/upload", uploadRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
