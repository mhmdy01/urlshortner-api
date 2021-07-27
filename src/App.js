import React from "react";
import { Button } from "react-bootstrap";
import urlServices from "./services/shortUrl";

const App = () => {
  const handleFetchOriginalUrl = () => {
    const originalUrl = urlServices.getOriginalUrl();
    console.log("GOTTEN SHORT URL: ", originalUrl);
  };

  const handleCreateShortUrl = async () => {
    const urlToShorten = {
      url: "http://google.co.jp",
    };
    const newShortUrl = urlServices.createShortUrl(urlToShorten);
    console.log("SHORT URL: ", newShortUrl);
  };

  return (
    <div className="main">
      <div>
        <h1 className="header">HEADER</h1>
        <div className="buttons">
          <Button className="btn1" onClick={handleFetchOriginalUrl}>
            Get URL
          </Button>
          <Button className="btn2" onClick={handleCreateShortUrl}>
            Create URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
