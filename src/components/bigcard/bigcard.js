import { useEffect, useState } from 'react'
import axios from 'axios'
import './bigcard.css'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const baseURL = 'https://api.themoviedb.org/3'
const baseImageUrl = 'https://image.tmdb.org/t/p/original'

const latterURL = `?api_key=${API_KEY}&language=en-US&append_to_response=credits`

function BigCard({ filmType, filmID }) {
    const [filmData, setFilmData] = useState([])
    const [directors, setDirectors] = useState([])
    const [actors, setActors] = useState([])
    const image = `${baseImageUrl}${filmData?.poster_path}`

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `${baseURL}/${filmType}/${filmID}${latterURL}`,
            )
            console.log(response.data)
            setFilmData(response.data)
            setDirectors(
                response.data.credits.crew.filter(
                    (mem) => mem.job === 'Director',
                ),
            )
            setActors(
                response.data.credits.cast
                    .filter((actor) => actor.popularity > 4)
                    .slice(0, 5),
            )
            return response
        }
        fetchData()
    }, [])

    return (
        <div
            className='outerContainer'
            style={{
                backgroundImage: `url(${baseImageUrl}${filmData.backdrop_path})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}>
            <div className='wrapper'>
                <div className='bigcard'>
                    <div className='pictureSide'>
                        <img
                            className='cardImg'
                            src={`${baseImageUrl}${filmData?.poster_path}`}
                            alt={filmData.name}
                        />
                    </div>
                    <div className='infoSide'>
                        <div className='infoRow'>
                            <span>{filmData.release_date?.slice(0, 4)} </span>
                            <span>{filmData?.runtime} min </span>
                        </div>
                        <div className='titleRow'>
                            {filmData?.original_title}
                        </div>
                        <div className='overviewRow'>
                            <p id='greyText'>Plot</p>
                            {filmData?.overview}
                        </div>
                        <div className='lastRow'>
                            <div className='col1'>
                                <p id='greyText'>Actors</p>
                                {actors.map((actor) => (
                                    <div key={actor.id} className='listItem'>
                                        {actor.name}
                                    </div>
                                ))}
                            </div>
                            <div className='col2'>
                                <p id='greyText'>Genres</p>
                                {filmData.genres?.map((genre) => (
                                    <div key={genre.id} className='listItem'>
                                        {genre.name}
                                    </div>
                                ))}
                                <p id='greyText'>Directors</p>
                                {directors.map((director) => (
                                    <div key={director.id} className='listItem'>
                                        {director.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BigCard
