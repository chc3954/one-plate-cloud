require("dotenv").config();

const API_KEY = process.env.API_KEY || "default";

function verifyApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];

  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}

module.exports = verifyApiKey;
