'use strict'

const { response } = require('express');
// **********REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
// *********** WE BRING EXPRESS TO CREATE A SERVER
const app = express();

//******* MIDDLEWARE - CORS */
app.use(cors());


// ****** DEFINE THE PORT
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on port ${PORT}`));

// ******** ENDPOINTS 

app.get('/', (request, response) => {
  response.status(200).send('Welcome t my server!');
});


app.get('/weather', async (request, response, next) => {
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
});

app.get('/movies', async (request, response, next) => {
  try {

    let frontCity = request.query.searchQuery;
    let moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${frontCity}`;

    let axiosUrl = await axios.get(moviesAPI);

    let movieToSend = axiosUrl.data.results.map(movie => {
      return new Movie(movie);
    });
    response.status(200).send(movieToSend);

  } catch (error) {
    next(error);
  }
});


//**** CLASSES TO GROUP DATA */
class Forecast {
  constructor(foreCastObj) {
    this.date = foreCastObj.valid_date;
    this.description = foreCastObj.weather.description;
    this.lon = foreCastObj.lon;
    this.lat = foreCastObj.la;
  }
}

class Movie {
  constructor(movieOb) {
    this.title = movieOb.title;
    this.overview = movieOb.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieOb.poster_path}`
  }
}

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
});
//**** CATCH ALL - AT THE BOTTOM AND SERVE AS A 404 */