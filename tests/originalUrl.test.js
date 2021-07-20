const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const API_URL = "/api/shorturl/lookup";

const urlToShorten = "http://google.co.jp";
beforeEach(async () => {
  // to create a short url first
  // we need to call the shorten endpoint first
  await api
    .post("/api/shorturl/shorten")
    .send(`url=${urlToShorten}`)
    .set("content-type", "application/x-www-form-urlencoded");
});

describe("lookup shorturl", () => {
  test("when: exists @db > redirect original", async () => {
    const short_url = "1";
    await api
      .get(`${API_URL}/${short_url}`)
      .expect(302)
      .expect("location", urlToShorten);
  });
  test("when: not_exist @db > 404", async () => {
    const short_url = "101";
    const res = await api.get(`${API_URL}/${short_url}`).expect(404);
    expect(res.body.error).toContain("No short URL found");
  });
});
