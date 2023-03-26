
const axios = require('axios');

let cache = {};

//TODO: create key for the data I'n going to store
//TODO: if the thing exists AND within a valid timeframe -send that data from cache
//TODO: fi the thing doesn't exist - call my API and cache that return from API



async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let key = `${lat},${lon}-Lat&Lon`; 
    
    if (cache[key] && (Date.now() - cache[key].timestamp) < 10000) {
      console.log('cache was hit!')

      response.status(200).send(cache[key].data)

    } else {
      console.log('no Items in cache');
      let weatherAPI = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
      let axiosUrl = await axios.get(weatherAPI);

      let weatherToSend = axiosUrl.data.data.map(day => { return new Forecast(day) });
      //TODO: Build it into CACHE

      cache[key] = {
        data: weatherToSend,
        timestamp: Date.now()
      };

      response.status(200).send(weatherToSend);
    }

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