const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "https://www.thetimes.co.uk/"
  },
  {
    name: "nytimes",
    base: "https://www.nytimes.com",
    address: "https://www.nytimes.com/section/climate",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const site = $(this).attr("href");
      

      articles.push({
        title,
        source: newspaper.name,
        url: newspaper.base + site
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to moo-ville");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => console.log(`I'm running on ${PORT}`));
