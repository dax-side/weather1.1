const express = require("express");
const https = require("https");
const app = express();

app.use(express.urlencoded());

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const units = "metric";
  const apikey = "62f26e04d8e08b535201a0a6abe06176";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apikey +
    "&units=" +
    units;

  https
    .get(url, (response) => {
      if (response.statusCode === 200) {
        response.on("data", (data) => {
          const weatherData = JSON.parse(data);
          const weatherDesc = weatherData.weather[0].description;
          const temp = weatherData.main.temp;
          const weatherIcon = weatherData.weather[0].icon;
          const imgUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

          res.send(`
              <div class="container">
                  <h1>Weather App</h1>
                  <form action="/" method="post">
                      <p>Enter the city name</p>
                      <input type="text" name="cityName" placeholder="e.g., London" required />
                      <button type="submit">Go</button>
                  </form>
                  <div class="result">
                      <p class="weather-info">The temperature in ${query} is ${temp}°C</p>
                      <p class="weather-info">The weather is described as ${weatherDesc}</p>
                      <img class="weather-icon" src="${imgUrl}" alt="Weather Icon">
                  </div>
              </div>
              <script>
                  changeBackground("${weatherDesc}");
              </script>
          `);
        });
      } else {
        res.status(response.statusCode).send(`
          <div class="container">
            <h1>Weather App</h1>
            <form action="/" method="post">
                <p>Enter the city name</p>
                <input type="text" name="cityName" placeholder="e.g., London" required />
                <button type="submit">Go</button>
            </form>
            <div class="result">
                <h3> City does not exist. Please try a valid city name.</h3>
            </div>
          </div>
        `);
      }
    })
    .on("error", (err) => {
      console.error("Error fetching weather data:", err.message);
      res.status(500).send("<h3>Internal Server Error</h3>");
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
