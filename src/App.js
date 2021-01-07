import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
require('dotenv').config()

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=`

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData(){ 
      const response = await axios.get(`${BASE_URL}${API_KEY}&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=1&with_watch_providers=8%7C9&watch_region=US`)
      setMovies(response.data.results)
      return response;
    }
    fetchData();
  },[]);
  console.log(movies);

  return (
    <div className="App">
      {movies.map( movie => <p>{movie.title}</p>)}
    </div>
  );
}

export default App;
