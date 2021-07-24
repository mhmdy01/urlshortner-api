let globalId = 0;

class ShortURL {
  constructor(originalUrl, shortUrl) {
    this.id = String(++globalId);
    this.short_url = shortUrl;
    this.original_url = originalUrl;
  }
}

const shortURLsDB = [];

module.exports = { ShortURL, shortURLsDB };
