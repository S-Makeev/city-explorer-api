
const axios = require('axios');


async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let weatherAPI = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let axiosUrl = await axios.get(weatherAPI);

    let weatherToSend = axiosUrl.data.data.map(day => { return new Forecast(day) });

    response.status(200).send(weatherToSend);
   } catch (error) {
    next(error);
  }
}


class Forecast {
  constructor(foreCastObj) {
    this.date = foreCastObj.valid_date;
    this.description = foreCastObj.weather.description;
    this.lon = foreCastObj.lon;
    this.lat = foreCastObj.la;
  }
}

module.exports = getWeather;