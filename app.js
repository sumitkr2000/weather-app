const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.post("/", (req, res) => {
  const query = req.body.city;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=cc6777de85e0c574383741f4825d2b1c&units=metric";

  https.get(url, function (response) {
    const code = response.statusCode;

    if (code === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;

        res.render(__dirname + "/views/result.ejs", {
          city: query,
          temp: temp,
          description: description,
          image: icon,
        });
      });
    } else {
      res.render(__dirname + "/views/failure.ejs");
    }
  });
});

app.listen(port, () => {
  console.log("server started");
});
