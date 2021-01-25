import { useEffect, useState } from 'react'
import axios from 'axios'
// import netflixlogo from './netflixlogo.jpg'
// import primelogo from './primelogo.jpg'
import './smallcard.css'

const baseImageUrl = 'https://image.tmdb.org/t/p/original/'
const baseProviderUrl = `https://api.themoviedb.org/3`
const API_KEY = process.env.REACT_APP_TMDB_API_KEY

function SmallCard({ filmType, film, logThis }) {
    // console.table(film)
    const [isHover, setHover] = useState(false)
    const [isNetflix, setNetflix] = useState(false)
    const [isPrime, setPrime] = useState(false)
    const [providers, setProvider] = useState([])

    const year = film?.release_date?.slice(0, 4) || film?.first_air_date?.slice(0, 4)
    const title = film?.title || film?.name

    useEffect(() => {
        setPrime(false)
        setNetflix(false)
        async function fetchData() {
            const response = await axios.get(
                `${baseProviderUrl}/${filmType}/${film.id}/watch/providers?api_key=${API_KEY}`,
            )
            setProvider(response.data.results?.US?.flatrate)
            checkProviders(response.data.results?.US?.flatrate)
            film.filmType = filmType
            return response
        }

        fetchData()
    }, [film])

    const checkProviders = (providers) => {
        if(providers){
            // console.log(" WE have Provider", providers.length, providers)
            if (providers.find((el) => el.provider_id === 9)) {
                // console.log('Prime found!!')
                setPrime(true)
            } 
            if (providers.find((el) => el.provider_id === 8)) {
                // console.log('Netflix found!!')
                setNetflix(true)
        }
    }
}

    //need to call TMDP API for streaming availability
    return (
        ( (isPrime||isNetflix) && <div className='card'>
            <img
                className='cardImg'
                src={`${baseImageUrl}${film.poster_path}`}
                alt={film.name}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            />
            {/* if hover -> display overlay with following info: film filmType, title, year, streaming availability */}
            <div className='overlay'>
                <div className='grid' onClick={() => logThis(film, filmType)}>
                    <div className='filmType'>{filmType}</div>
                    <div className='filmTitle'>{title}</div>
                    <div className='filmYear'>{year}</div>
                    <div className='fileProviders'>
                        {isNetflix &&(
                            <img
                                src='/netflixlogo.jpg'
                                className='logo'
                                alt='netflix'
                            />
                        )}
                        {isPrime && (
                            <img
                                src='/primelogo.jpg'
                                className='logo'
                                alt='prime'
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
        )

        // if click -> go to its info page (seperate url)
    )
}

export default SmallCard
