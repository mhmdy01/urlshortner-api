const dnsPromises = require("dns").promises;
const { shortURLsDB, ShortURL } = require("../models/shortUrl");
const helper = require("../utils/helper");
const ShortUrl = require("../models/shortUrl");

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

const createShortURL = async (req, res, next) => {
  console.log("Short URL: ", helper.createShortUrl(15));
  const shortURLRecord = new ShortURL(req.urlToShorten);
  shortURLsDB.push(shortURLRecord);
  delete shortURLRecord.id;
  req.shortURLRecord = shortURLRecord;
  // I am not sure if this is who you execute this logic so please check it and make the proper changes
  const shortUrl = new ShortUrl({
    short_url: helper.createShortUrl(15),
    original_url: req.urlToShorten,
  });
  const savedShortUrl = await shortUrl.save();
  next(savedShortUrl);
};

const sendShortURL = (req, res, next) => {
  res.json(req.shortURLRecord);
};

module.exports = {
  extractURLToShorten,
  createShortURL,
  sendShortURL,
};