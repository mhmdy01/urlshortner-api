const mongoose = require("mongoose");

const shortUrlSchema = mongoose.Schema({
  short_url: String,
  original_url: String,
});

shortUrlSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);

// let globalId = 0;

// class ShortURL {
//   constructor(originalURL) {
//     this.id = Number(++globalId);
//     this.short_url = this.id;
//     this.original_url = originalURL;
//   }
// }

// const shortURLsDB = [];

// module.exports = { ShortURL, shortURLsDB };
