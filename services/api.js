const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getpopularMovies = async (pages = 5) => {
  const allMovies = [];
  
  for (let page = 1; page <= pages; page++) {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    allMovies.push(...data.results);
  }
  
  return allMovies; // Returns 100 movies if pages=5
}

export const searchMovies = async (query, pages = 5) => {
  const allMovies = [];
  
  for (let page = 1; page <= pages; page++) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
    allMovies.push(...data.results);
  }
  
  return allMovies; // Returns 100 movies if pages=5
}