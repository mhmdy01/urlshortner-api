import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const App = () => {
  const baseUrl = "/api/shorturl";

  const handleFetchOriginalUrl = () => {
    const getShortUrl = axios.get(`${baseUrl}/lookup/:short_url`);
    console.log("GOTTEN SHORT URL: ", getShortUrl);
  };

  const handleCreateShortUrl = () => {
    const createShortUrl = axios.post(
      `${baseUrl}/shorten`,
      "url=http://awesome_app.co"
    );
    console.log("SHORT URL: ", createShortUrl);
  };

  return (
    <div className="">
      <div>
        <h1>HEADER</h1>
        <Button onClick={handleFetchOriginalUrl}>Get URL</Button>
        <Button onClick={handleCreateShortUrl}>Create URL</Button>
      </div>
    </div>
  );
};

export default App;
