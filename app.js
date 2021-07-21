require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const shortURLController = require("./controllers/shortUrl");
const originalURLController = require("./controllers/originalUrl");
const helper = require("./utils/helper");

const urlRouter = require("./controllers/shortUrlRouter");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// TODO/routing: how good is each method
// single route > app.route().post().get()
// eg: app.route("/api/shorturl/:short_url?")
// vs
// separate routes > app.get(route), app.post(route)
// app.post(
//   "/api/shorturl/shorten",
//   shortURLController.extractURLToShorten,
//   shortURLController.createShortURL,
//   shortURLController.sendShortURL
// );
// app.get(
//   "/api/shorturl/lookup/:short_url",
//   originalURLController.extractShortURL,
//   originalURLController.lookupOriginalURL,
//   originalURLController.sendOriginalURL
// );

app.use("/api/shorturl", urlRouter);
app.use("/api/shorturl/shorten", shortURLController.extractURLToShorten);
app.use("/api/shorturl/shorten", shortURLController.createShortURL);
app.use("/api/shorturl/shorten", shortURLController.sendShortURL);
app.use(
  "/api/shorturl/lookup/:short_url",
  originalURLController.extractShortURL
);
app.use(
  "/api/shorturl/lookup/:short_url",
  originalURLController.lookupOriginalURL
);
app.use(
  "/api/shorturl/lookup/:short_url",
  originalURLController.sendOriginalURL
);

app.use(middleware.unknownEndpointHandler);
app.use(middleware.errorHandler);

console.log("Short URL: ", helper.createShortUrl());

module.exports = app;
