'use strict'

const { response } = require('express');
// **********REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weather = require('./data/weather.json');
// *********** WE BRING EXPRESS TO CREATE A SERVER
const app = express();

//******* MIDDLEWARE - CORS */
app.use(cors());


// ****** DEFINE THE PORT
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on port ${PORT}`));

// ******** ENDPOINTS 

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
}); 

app.get('/weather', (request, response, next) => {
  try {
    let cityName = request.query.city;
    let lat = request.query.lat;
    let lon = request.query.lon;

     let cityData = weather.find(city => city.city_name.toLowerCase() === cityName.toLowerCase());
      let weatherToSend = cityData.data.map(day => {return new Forecast(day)});
    response.status(200).send(weatherToSend);
  }catch (error) {
      next(error);
  }
});

//**** CLASSES TO GROUP DATA */
class Forecast {
  constructor(foreCastObj)
  {
    this.date = foreCastObj.valid_date;
    this.description = foreCastObj.weather.description;
  }
}


// *** MIDDLEWARE HANDLING ERRORS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

//**** CATCH ALL - AT THE BOTTOM AND SERVE AS A 404 */
app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
});