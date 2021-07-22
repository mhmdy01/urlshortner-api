require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const shortURLController = require("./controllers/shortUrl");
const originalURLController = require("./controllers/originalUrl");

const app = express();
app.use(express.static("build"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// TODO/routing: how good is each method
// single route > app.route().post().get()
// eg: app.route("/api/shorturl/:short_url?")
// vs
// separate routes > app.get(route), app.post(route)
app.post(
  "/api/shorturl/shorten",
  shortURLController.extractURLToShorten,
  shortURLController.createShortURL,
  shortURLController.sendShortURL
);
app.get(
  "/api/shorturl/lookup/:short_url",
  originalURLController.extractShortURL,
  originalURLController.lookupOriginalURL,
  originalURLController.sendOriginalURL
);

app.use(middleware.unknownEndpointHandler);
app.use(middleware.errorHandler);

module.exports = app;
