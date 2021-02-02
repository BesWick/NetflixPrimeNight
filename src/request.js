import axios from "axios"

require("dotenv").config()

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=`
const SEARCH_URL = `https://api.themoviedb.org/3/search/multi?api_key=`

//pages 1-5 results, one array for the discover and one for the search

export function createDiscoverRequests(n) {
    const res = []
    for (let i = 1; i <= n; i++) {
        res.push(
            axios.get(
                `${BASE_URL}${API_KEY}&language=en-US&sort_by=revenue.desc&include_video=false&page=${i}&with_watch_providers=8%7C9&watch_region=US`,
            ),
        )
    }
    return res
}

export function createSearchRequests(n, search, cancel) {
    const res = []
    for (let i = 1; i <= n; i++) {
        res.push(
            axios.get(
                `${SEARCH_URL}${API_KEY}&language=en-US&query=${search}&page=${i}&region=US`,
                {
                    cancelToken: cancel.token,
                },
            ),
        )
    }
    return res
}

// const [movies, setMovies] = useState([]);
// const [page, setPage] = useState(1);

// const getMovies = async () => {
//   try{
//     let req = await fetch(`'https://api.themoviedb.org/3/movie/now_playing?api_key=#&language=en-US&page=${page}`);
//     let data = await req.json();
//     // spread the content of movies and data
//     setMovies([...movies, ...data]);
//   }catch(err){
//    throw err
//   }
// }
