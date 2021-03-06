import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import SmallCard from './components/smallcard/smallcard'
import BigCard from './components/bigcard/bigcard'
import SearchBar from './components/searchbar/searchbar'
import { createDiscoverRequests, createSearchRequests } from './request'
require('dotenv').config()

function App() {
    const [films, setFilms] = useState([])
    const [cache, setCache] = useState([])
    const [bigCardFlag, setBigCardFlag] = useState(false)
    const [bigCardData, setBigCardData] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchData() {
            const reqArray = createDiscoverRequests(3)
            const resultArray = []
            axios
                .all(reqArray)
                .then(
                    axios.spread((...responses) => {
                        responses.forEach((response) => {
                            let data = response.data.results
                            // console.log(
                            //     'Success',
                            //     typeof data,
                            //     data,
                            //     response.data,
                            // )
                            resultArray.push(...data)
                        })
                        // console.log('submitted all axios calls', resultArray)
                        setCache(resultArray)
                        setFilms(resultArray)
                        return resultArray
                    }),
                )
                .catch((err) => console.log(err))
        }
        fetchData()
    }, [])
    useEffect(() => {
        const source = axios.CancelToken.source()

        if (search === '') {
            console.log('EMPTY')
            setFilms(cache) //discover
        } else {
            //time to search w/ query
            searchTMDB(source)
        }
        return () => {
            source.cancel('component')
        }
    }, [search])

    const searchTMDB = async (source) => {
        const reqArray = createSearchRequests(7, search, source)
        const resultArray = []
        axios
            .all(reqArray)
            .then(
                axios.spread((...responses) => {
                    responses.forEach((response) => {
                        let data = response.data.results
                        //  console.log('Success', typeof data, data, response.data)
                        resultArray.push(...data)
                    })
                    // console.log("submitted all axios calls", resultArray)
                    let modifiedArray = resultArray.filter(
                        (a) =>
                            a.media_type !== 'person' &&
                            a.poster_path !== null &&
                            a.backdrop_path != null,
                    )
                    // setFilms(modifiedArray)
                    setFilms(
                        modifiedArray.filter(
                            ((set) => (f) => !set.has(f.id) && set.add(f.id))(
                                new Set(),
                            ),
                        ),
                    )
                    return modifiedArray
                }),
            )
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    console.log(err)
                }
            })
    }

    const showBigCard = (value, filmType) => {
        // console.log(value, filmType)
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
                    isPrime={bigCardData.isPrime}
                    isNetflix={bigCardData.isNetflix}
                    togglePopup={() => setBigCardFlag(!bigCardFlag)}
                />
            )}
        </div>
    )
}

export default App
