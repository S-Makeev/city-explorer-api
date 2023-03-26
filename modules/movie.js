
const axios = require('axios');

let cache = {};

async function getMovies(request, response, next)
{
  try {
    let frontCity = request.query.searchQuery;

    let key = `${frontCity}-movie`


    if(cache[key] && (Date.now() - cache[key].timestamp) < 10000) {
      console.log('cache for movies was hit!')

      response.status(200).send(cache[key].data)
    }
    else{
      console.log('no itemse in cache for movies');

      let moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${frontCity}`;
      let axiosUrl = await axios.get(moviesAPI);
      
      let moviesToSend = axiosUrl.data.results.map(movie => { return new Movie(movie) });
  
      cache[key] = {
        data:moviesToSend,
        timestamp: Date.now()
      };


      response.status(200).send(moviesToSend);
    }

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