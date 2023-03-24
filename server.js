'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const getWeather = require ('./modules/weather');
const getMovies = require ('./modules/movie')



app.use(cors());

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on port ${PORT}`));


app.get('/', (request, response) => {
  response.status(200).send('Welcome t my server!');
});
  
app.get('/weather', getWeather)
app.get('/movies', getMovies)


app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
});
