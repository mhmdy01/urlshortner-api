const unknownEndpointHandler = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  switch (err.code) {
    case "ERR_INVALID_URL":
      return res.status(400).json({ error: "Invalid URL" });
    case "ENOTFOUND":
      return res.status(400).json({ error: "Invalid Hostname" });
    case "CastError":
      return res.status(400).json({ error: "wrong field: id" });
    case "ValidationError":
      return res.status(400).json({ error: err.message });
    default:
      next(err);
  }
};

module.exports = {
  errorHandler,
  unknownEndpointHandler,
};
