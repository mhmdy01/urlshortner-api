const generateRandomStr = (len = 7) => {
  const allowedCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const allowedCharactersCount = allowedCharacters.length;
  const randomCharacters = [];
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * allowedCharactersCount);
    randomCharacters.push(allowedCharacters[randomIndex]);
  }
  return randomCharacters.join("");
};

module.exports = {
  generateRandomStr,
};
