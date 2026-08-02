const maptiler = require("@maptiler/client");

maptiler.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports = maptiler;