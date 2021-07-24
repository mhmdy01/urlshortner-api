let globalId = 0;

class ShortURL {
  constructor(originalURL) {
    this.id = String(++globalId);
    this.short_url = this.id;
    this.original_url = originalURL;
  }
}

const shortURLsDB = [];

module.exports = { ShortURL, shortURLsDB };
