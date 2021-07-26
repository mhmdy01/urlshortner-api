const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const ShortUrl = require("../models/shortUrl");
const { generateRandomStr } = require("../utils/helpers");

// globals
const api = supertest(app);
const API_URL = "/api/shorturls";
const validUrlToShorten = "http://google.co.jp";
let shortUrlFromDb = "";

// to lookup a short url we first need to create one
// ie. call the shorten endpoint first
beforeEach(async () => {
  await ShortUrl.deleteMany({});
  const shortUrlToAdd = {
    short_url: generateRandomStr(7),
    original_url: validUrlToShorten,
  };
  const shortUrlDoc = new ShortUrl(shortUrlToAdd);
  const savedShortUrl = await shortUrlDoc.save();
  shortUrlFromDb = savedShortUrl.short_url;
});

// validation criteria for urlToShorten?
// is_legal (can be parsed)
// is_web (uses http)
// is_real (can be visited.. ie. dns lookup-ed)
describe("POST /api/shorturls", () => {
  test("when: is_legal, is_web, is_real > 200, shorturl", async () => {
    const urlToShorten = {
      url: validUrlToShorten,
    };
    const res = await api
      .post(API_URL)
      .send(urlToShorten)
      .expect(200)
      .expect("content-type", /application\/json/);
    // console.log(res.body);

    const { short_url, original_url } = res.body;
    expect(short_url).toBeDefined();
    expect(short_url).toHaveLength(7);
    expect(original_url).toBeDefined();
    expect(original_url).toBe(validUrlToShorten);
  });
  test("when: is_legal, is_web, not_real > 400, invalid host", async () => {
    const urlToShorten = {
      url: "http://google.jp.co",
    };
    const res = await api
      .post(API_URL)
      .send(urlToShorten)
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid Hostname");
  });
  test("when: is_legal, not_web > 400, invalid url", async () => {
    const urlToShorten = {
      url: "ftp://john-doe.com",
    };
    const res = await api
      .post(API_URL)
      .send(urlToShorten)
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid URL");
  });
  test("when: not_legal > 400, invalid url", async () => {
    const urlToShorten = {
      url: "some-bad-url",
    };
    const res = await api
      .post(API_URL)
      .send(urlToShorten)
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid URL");
  });
});

describe("GET /api/shorturls/:short_url", () => {
  test("when: exists @db > redirect original", async () => {
    const shortUrlToLookup = shortUrlFromDb;
    await api
      .get(`${API_URL}/${shortUrlToLookup}`)
      .expect(302)
      .expect("location", validUrlToShorten);
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
