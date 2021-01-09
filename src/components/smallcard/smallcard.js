import { useEffect, useState } from 'react'
import axios from 'axios'
import './smallcard.css'

const baseImageUrl = 'https://image.tmdb.org/t/p/original/'
const baseProviderUrl = `https://api.themoviedb.org/3`
const API_KEY = process.env.REACT_APP_TMDB_API_KEY

function SmallCard({ type, film }) {
    const [isHover, setHover] = useState(false)
    const [provider, setProvider] = useState('')

    const year = film.release_date.slice(0, 4)
    const title = film.title

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `${baseProviderUrl}/${type}/${film.id}/watch/providers?api_key=${API_KEY}`,
            )
            setProvider(response.data.results.US.flatrate)
            return response
        }
        fetchData()
    }, [])
    console.table(provider)

    //need to call TMDP API for streaming availability
    return (
        <div className='card'>
            <img
                className='cardImg'
                src={`${baseImageUrl}${film.poster_path}`}
                alt={film.name}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            />
            {/* if hover -> display overlay with following info: film type, title, year, streaming availability */}
            <div className='overlay'>
                <div className='grid'>
                    <div className='filmType'>{type}</div>
                    <div className='filmTitle'>{title}</div>
                    <div className='filmYear'>{year}</div>
                </div>
            </div>
        </div>

        // if click -> go to its info page (seperate url)
    )
}

export default SmallCard
