const unknownEndpointHandler = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  switch (err.code) {
    case "ERR_INVALID_URL":
      res.status(400).json({ error: "Invalid URL" });
      break;
    case "ENOTFOUND":
      res.status(400).json({ error: "Invalid Hostname" });
      break;
    default:
      next(err);
  }
};

module.exports = {
  errorHandler,
  unknownEndpointHandler,
};
