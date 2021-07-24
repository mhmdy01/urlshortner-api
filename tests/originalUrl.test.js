const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const API_URL = "/api/shorturl/lookup";

const urlToShorten = "http://google.co.jp";
let shortUrlFromDb = "";
// to lookup a short url we first need to create one
// ie. call the shorten endpoint first
beforeEach(async () => {
  const res = await api
    .post("/api/shorturl/shorten")
    .send(`url=${urlToShorten}`)
    .set("content-type", "application/x-www-form-urlencoded");
  shortUrlFromDb = res.body.short_url;
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
