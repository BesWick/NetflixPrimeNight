import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import SmallCard from './components/smallcard/smallcard'
import BigCard from './components/bigcard/bigcard'
import SearchBar from './components/searchbar/searchbar'
require('dotenv').config()

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=`

function App() {
    const [films, setFilms] = useState([])
    const [bigCardFlag, setBigCardFlag] = useState(false)
    const [bigCardData, setBigCardData] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `${BASE_URL}${API_KEY}&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=2&with_watch_providers=8%7C9&watch_region=US`,
            )
            setFilms(response.data.results)
            console.log(response.data.results)
            return response
        }
        fetchData()
    }, [])
    const showBigCard = (value, filmType) => {
        console.log(value, filmType)
        setBigCardFlag(!bigCardFlag)
        setBigCardData(value)
    }

    // console.log(bigCardFlag)

    return (
        <div className='App'>
            {!bigCardFlag && (
                <div className='bigContainer'>
                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                    <div className='container'>
                        {films.map((film) => (
                            <SmallCard
                                key={films.id}
                                filmType='movie'
                                film={film}
                                logThis={showBigCard}
                            />
                        ))}
                    </div>
                </div>
            )}
            {bigCardFlag && (
                <BigCard
                    filmType={bigCardData.filmType}
                    filmID={bigCardData.id}
                    togglePopup={() => setBigCardFlag(!bigCardFlag)}
                />
            )}
        </div>
    )
}

export default App
