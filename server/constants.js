const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

module.exports = {
  PORT,
  SERVER_URL,
};