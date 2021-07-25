const ShortUrl = require("../models/shortUrl");

const extractShortURL = (req, res, next) => {
  const { short_url } = req.params;
  req.shortURL = short_url;
  next();
};

const lookupOriginalURL = async (req, res, next) => {
  const shortUrlFromDb = await ShortUrl.findOne({ short_url: req.shortURL });
  req.originalURL = !shortUrlFromDb ? null : shortUrlFromDb.original_url;
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
