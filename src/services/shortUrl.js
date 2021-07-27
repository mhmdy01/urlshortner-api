import axios from "axios";
const baseUrl = "https://urlshortner-api.mhmdy01.repl.co";

const createShortUrl = (urlToShorten) => {
  const response = axios.post(`/${baseUrl}`, urlToShorten);
  console.log("SHORT URL: ", response.data);
  return response.data;
};

const getOriginalUrl = async () => {
  const response = await axios.get(`/${baseUrl}/:short_url`);
  console.log("GOTTEN SHORT URL: ", response.data);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { createShortUrl, getOriginalUrl };
