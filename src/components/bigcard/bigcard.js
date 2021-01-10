import { useEffect, useState } from 'react'
import axios from 'axios'
import './bigcard.css'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const baseURL = 'https://api.themoviedb.org/3'

const latterURL = `?api_key=${API_KEY}&language=en-US&append_to_response=credits`

function BigCard({ filmType, filmID }) {
    const [filmData, setFilmData] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `${baseURL}/${filmType}/${filmID}${latterURL}`,
            )
            console.log(response.data)
            setFilmData(response.data)
            return response
        }
        fetchData()
    }, [])
    console.log('title:', filmData.original_title)

    return (
        <div className='bigcard'>
            <div className='infoRow'>
                {filmData.release_date?.slice(0, 4)}
                {filmData?.runtime} min
            </div>
            <div className='titleRow'>{filmData?.original_title}</div>
            <div className='overviewRow'>
                <p>Plot</p>
                {filmData?.overview}
            </div>
            <div className='lastRow'>
                <div className='col1'></div>
                <div className='col2'></div>
            </div>
        </div>
    )
}

export default BigCard