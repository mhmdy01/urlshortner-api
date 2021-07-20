const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const API_URL = "/api/shorturl/shorten";

// validation criteria for urlToShorten?
// is_legal (can be parsed)
// is_web (uses http)
// is_real (can be visited.. ie. dns lookup-ed)
describe("shorten url", () => {
  test("when: is_legal, is_web, is_real > 200, shorturl", async () => {
    const urlToShorten = "http://google.co.jp";
    const res = await api
      .post(API_URL)
      .send(`url=${urlToShorten}`)
      .set("content-type", "application/x-www-form-urlencoded")
      .expect(200)
      .expect("content-type", /application\/json/);

    const shortURL = res.body;
    expect(shortURL.short_url).toBeDefined();
    expect(shortURL.original_url).toBeDefined();
    expect(shortURL.original_url).toBe(urlToShorten);
  });
  test("when: is_legal, is_web, not_real > 400, invalid host", async () => {
    const urlToShorten = "http://google.jp.co";
    const res = await api
      .post(API_URL)
      .send(`url=${urlToShorten}`)
      .set("content-type", "application/x-www-form-urlencoded")
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid Hostname");
  });
  test("when: is_legal, not_web > 400, invalid url", async () => {
    const urlToShorten = "ftp://john-doe.com";
    const res = await api
      .post(API_URL)
      .send(`url=${urlToShorten}`)
      .set("content-type", "application/x-www-form-urlencoded")
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid URL");
  });
  test("when: not_legal > 400, invalid url", async () => {
    const urlToShorten = "some-bad-url";
    const res = await api
      .post(API_URL)
      .send(`url=${urlToShorten}`)
      .set("content-type", "application/x-www-form-urlencoded")
      .expect(400)
      .expect("content-type", /application\/json/);

    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe("Invalid URL");
  });
});
