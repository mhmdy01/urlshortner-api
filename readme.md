## specs/SRS (mapped to MVC)

### shorten URL (POST /api/shorturl/shorten)

- in? url (req body)
- out? json {short, original}
- logic? shorten, store, send
- errors? invalid url
  > what is valid URL?
  >
  > - legal (can be parsed)
  > - web (http protocol only)
  > - real (can be dns lookup-ed)

### lookup short URL (GET /api/shorturl/lookup/:short_url)

- in? shorturl (query param)
- out? redirect original
- logic? find/lookup, send
- errors? short not exist @DB

---

## TODO

- [x] use a DB (instead of in-memory array)
- [x] generate actual random shorturls (instead of using only the ID)
- [ ] deploy @heroku
