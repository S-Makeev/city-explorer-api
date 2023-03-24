
const axios = require('axios');

async function getMovies(request, response, next)
{
  try {

    let frontCity = request.query.searchQuery;
    let moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${frontCity}`;
    let axiosUrl = await axios.get(moviesAPI);
    
    let moviesToSend = axiosUrl.data.results.map(movie => { return new Movie(movie) });

    response.status(200).send(moviesToSend);
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieOb) {
    this.title = movieOb.original_title;
    this.overview = movieOb.overview;
    this.image = `https://image.tmdb.org/t/p/w500${movieOb.poster_path}`
  }
}

module.exports = getMovies;