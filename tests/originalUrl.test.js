const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const ShortUrl = require("../models/shortUrl");
const { generateRandomStr } = require("../utils/helpers");

const api = supertest(app);
const API_URL = "/api/shorturl/lookup";

const urlToShorten = "http://google.co.jp";
let shortUrlFromDb = "";
// to lookup a short url we first need to create one
// ie. call the shorten endpoint first
beforeEach(async () => {
  await ShortUrl.deleteMany({});
  const shortUrlToAdd = {
    short_url: generateRandomStr(7),
    original_url: urlToShorten,
  };
  const shortUrlDoc = new ShortUrl(shortUrlToAdd);
  const savedShortUrl = await shortUrlDoc.save();
  shortUrlFromDb = savedShortUrl.short_url;
});

describe("lookup shorturl", () => {
  test("when: exists @db > redirect original", async () => {
    const shortUrlToLookup = shortUrlFromDb;
    await api
      .get(`${API_URL}/${shortUrlToLookup}`)
      .expect(302)
      .expect("location", urlToShorten);
  });
  test("when: not_exist @db > 404", async () => {
    const shortUrlToLookup = shortUrlFromDb.toUpperCase();
    const res = await api.get(`${API_URL}/${shortUrlToLookup}`).expect(404);
    expect(res.body.error).toContain("No short URL found");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
