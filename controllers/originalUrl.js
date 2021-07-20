const { shortURLsDB } = require("../models/shortUrl");

const extractShortURL = (req, res, next) => {
  const { short_url } = req.params;
  req.shortURL = short_url;
  next();
};

const lookupOriginalURL = (req, res, next) => {
  const originalURLRecord = shortURLsDB.find(
    (record) => record.short_url == req.shortURL
  );
  req.originalURL = !originalURLRecord ? null : originalURLRecord.original_url;
  next();
};
const sendOriginalURL = (req, res, next) => {
  if (!req.originalURL) {
    return res
      .status(404)
      .json({ error: "No short URL found for the given input" });
  }
  res.status(302).header("location", req.originalURL).end();
};

module.exports = {
  extractShortURL,
  lookupOriginalURL,
  sendOriginalURL,
};
