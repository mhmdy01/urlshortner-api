const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  short_url: { type: String, required: true },
  original_url: { type: String, required: true },
});
shortUrlSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
