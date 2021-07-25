require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");
const shortURLController = require("./controllers/shortUrl");
const originalURLController = require("./controllers/originalUrl");

mongoose
  .connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info(`connect_db | success | ${config.DB_URL}`))
  .catch((error) => {
    logger.error(`connect_db | error | ${error.name} | ${error.message}`);
  });

const app = express();
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
