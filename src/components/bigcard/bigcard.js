import { useEffect, useState } from "react"
import axios from "axios"
import "./bigcard.css"

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const baseURL = "https://api.themoviedb.org/3"
const baseImageUrl = "https://image.tmdb.org/t/p/original/"

const latterURL = `?api_key=${API_KEY}&language=en-US&append_to_response=credits`

function BigCard({ filmType, filmID, togglePopup }) {
    const [filmData, setFilmData] = useState([])
    const [directors, setDirectors] = useState([])
    const [actors, setActors] = useState([])

    const year =
        filmData?.release_date?.slice(0, 4) ||
        filmData?.first_air_date?.slice(0, 4)
    const title = filmData?.title || filmData?.name
    const runtime = filmData?.runtime || filmData?.episode_run_time

    useEffect(() => {
        const source = axios.CancelToken.source()
        async function fetchData() {
            try {
                const response = await axios.get(
                    `${baseURL}/${filmType}/${filmID}${latterURL}`,
                    {
                        cancelToken: source.token,
                    },
                )
                console.log(response.data)
                setFilmData(response.data)
                setDirectors(
                    response.data.credits.crew.filter(
                        (mem) => mem.job === "Director",
                    ),
                )
                setActors(
                    response.data.credits.cast
                        .filter((actor) => actor.popularity > 3)
                        .slice(0, 5),
                )
                return response
            } catch (err) {
                if (!axios.isCancel(err)) {
                    alert(err)
                    // console.log(err.message) // => prints: Api is being canceled
                }
            }
        }
        fetchData()
        return () => {
            source.cancel("Component got unmounted")
        }
    }, [])

    return (
        <div
            className='outerContainer'
            style={{
                backgroundImage: `url(${baseImageUrl}${filmData?.backdrop_path})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
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
                            <span>{year} </span>
                            <span>{runtime} min </span>
                            {filmData.seasons?.length && (
                                <span>{filmData.seasons?.length} seaons</span>
                            )}
                        </div>
                        <div className='titleRow'>{title}</div>
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
                    <input
                        type='button'
                        value='x'
                        id='close'
                        onClick={togglePopup}
                    />
                </div>
            </div>
        </div>
    )
}

export default BigCard
