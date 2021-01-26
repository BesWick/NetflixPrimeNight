import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import SmallCard from './components/smallcard/smallcard'
import BigCard from './components/bigcard/bigcard'
import SearchBar from './components/searchbar/searchbar'
import {createDiscoverRequests, createSearchRequests} from './request'
require('dotenv').config()

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=`
const SEARCH_URL = `https://api.themoviedb.org/3/search/multi?api_key=`

function App() {
    const [films, setFilms] = useState([])
    const [cache, setCache] = useState([])
    const [filmType, setFilmType] = useState([])
    const [bigCardFlag, setBigCardFlag] = useState(false)
    const [bigCardData, setBigCardData] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchData() {
            const reqArray =  createDiscoverRequests(3)
            const resultArray = []
            axios.all(reqArray)
            .then(axios.spread((...responses) => {
                responses.forEach(response =>{
                    let data = response.data.results
                     console.log('Success', typeof data, data, response.data)
                     resultArray.push(...data)
                    })
                    console.log('submitted all axios calls', resultArray);
                    setCache(resultArray)
                    setFilms(resultArray)
                    return resultArray
                })).catch(err => console.log(err))
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (search == '') {
            console.log('EMPTY')
            setFilms(cache) //discover
        } else {
            //time to search w/ query
            searchTMDB()
        }
    }, [search])

    const searchTMDB = async () => {
        try {
            const { data } = await axios.get(
                `${SEARCH_URL}${API_KEY}&language=en-US&query=${search}&region=US`,
            )
            // console.log('DATA', data.results)
            let modifiedArray = data.results.filter(
                (a) => a.media_type != 'person',
            )
            console.log('MODIFIED DATA', modifiedArray)
            setFilms(modifiedArray)
        } catch (err) {
            console.log(err.message)
        }
    }

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
                        <div className='innerContainer'>
                            {films.map((film) => (
                                <SmallCard
                                    key={film.id}
                                    filmType={film?.media_type || 'movie'}
                                    film={film}
                                    logThis={showBigCard}
                                />
                            ))}
                        </div>
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
