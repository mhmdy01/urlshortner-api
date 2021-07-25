const dnsPromises = require("dns").promises;
const ShortUrl = require("../models/shortUrl");
const { generateRandomStr } = require("../utils/helpers");

// validation criteria for urlToShorten?
// is_legal (can be parsed)
// is_web (uses http)
// is_real (can be visited.. ie. dns lookup-ed)
const extractURLToShorten = async (req, res, next) => {
  const { url: urlToShorten } = req.body;

  // is_legal
  const urlToShortenObj = new URL(urlToShorten);

  // is_web
  if (!urlToShortenObj.protocol.startsWith("http")) {
    const error = new Error();
    error.code = "ERR_INVALID_URL";
    throw error;
  }

  // is_real
  const address = await dnsPromises.lookup(urlToShortenObj.hostname);
  req.urlToShorten = urlToShorten;
  next();
};

// TODO/decisions/generate-random-shorturl: max_len, allowed chars?
// max_len: 7
// allowed_chars: letters (both cases), digits
const createShortURL = async (req, res, next) => {
  const shortUrlToAdd = {
    short_url: generateRandomStr(7),
    original_url: req.urlToShorten,
  };
  const shortUrlDoc = new ShortUrl(shortUrlToAdd);
  const savedShortUrl = await shortUrlDoc.save();
  req.savedShortUrl = savedShortUrl;
  next();
};

const sendShortURL = (req, res, next) => {
  res.json(req.savedShortUrl);
};

module.exports = {
  extractURLToShorten,
  createShortURL,
  sendShortURL,
};
