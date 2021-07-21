const urlRouter = require("express").Router();
const dnsPromises = require("dns").promises;
const ShortUrl = require("../models/shortUrl");
const helper = require("../utils/helper");

// /api/shorturl/shorten

// /api/shorturl/lookup/:short_url

urlRouter.get("/lookup/:short_url", (request, reponse) => {});

urlRouter.post("/shorten", async (request, response) => {
  const { url: urlToShorten } = request.body;
  console.log("BODY: ", urlToShorten);
  const urlToShortenObj = new URL(urlToShorten);
  console.log("NEW URL: ", urlToShortenObj);

  // is_web
  if (!urlToShortenObj.protocol.startsWith("http")) {
    response.status(401).json({ error: "ERR_INVALID_URL" });
  }

  // is_real
  // const address = await dnsPromises.lookup(urlToShortenObj.hostname);
  // console.log("ADDRESS: ", address);
  // next();
  const shortenUrl = new ShortUrl({
    original_url: urlToShorten,
    short_url: helper.createShortUrl(),
  });

  console.log("SHORTEN URL: ", shortenUrl);
  response.status(201).json(shortenUrl);
});

module.exports = urlRouter;
