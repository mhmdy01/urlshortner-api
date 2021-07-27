const dnsPromises = require("dns").promises;
const shortUrlsRouter = require("express").Router();
const ShortUrl = require("../models/shortUrl");
const { generateRandomStr } = require("../utils/helpers");

shortUrlsRouter.post("/", async (req, res, next) => {
  // extract url to shorten
  const { url: urlToShorten } = req.body;

  // console.log({ urlToShorten });

  // validation criteria for urlToShorten?
  // is_legal, is_web, is_real

  // is_legal (can be parsed)
  // throws error if not valid url
  const urlToShortenObj = new URL(urlToShorten);

  // is_web (uses http)
  if (!urlToShortenObj.protocol.startsWith("http")) {
    const error = new Error();
    error.code = "ERR_INVALID_URL";
    throw error;
  }
  // is_real (can be visited.. ie. dns lookup-ed)
  // throws error if cant dns lookup: eg. not-exist or timeout
  await dnsPromises.lookup(urlToShortenObj.hostname);

  // create shorturl
  // TODO/decisions/generate-random-shorturl: max_len, allowed chars?
  // max_len: 7
  // allowed_chars: letters (both cases), digits
  const shortUrlToAdd = {
    short_url: generateRandomStr(7),
    original_url: urlToShorten,
  };
  const shortUrlDoc = new ShortUrl(shortUrlToAdd);
  const savedShortUrl = await shortUrlDoc.save();

  // send
  res.json(savedShortUrl);

  // res.status(201).send({ message: "you got it" });
});

shortUrlsRouter.get("/:short_url", async (req, res, next) => {
  // extract shorturl
  const { short_url } = req.params;

  console.log({ short_url });

  // lookup @db
  const shortUrlFromDb = await ShortUrl.findOne({ short_url });

  // send
  if (!shortUrlFromDb) {
    return res
      .status(404)
      .json({ error: "No short URL found for the given input" });
  }
  res.status(302).header("location", shortUrlFromDb.original_url).end();

  // res.status(201).send({ message: "you got it" });
});

module.exports = shortUrlsRouter;
