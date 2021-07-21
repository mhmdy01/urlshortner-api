const charac = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const createShortUrl = (url_len) => {
  let shortUrl = "";
  for (let i = 0; i < url_len; i++) {
    const index = Math.floor(Math.random() * 62);
    shortUrl = shortUrl.concat(charac.charAt(index));
  }
  return shortUrl;
};

module.exports = {
  createShortUrl,
};
