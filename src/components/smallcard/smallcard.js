import React, { useState } from 'react'
import './smallcard.css'

const baseImageUrl = 'https://image.tmdb.org/t/p/original/'

function SmallCard({ type, film }) {
    const [isHover, setHover] = useState(false)

    //need to call TMDP API for streaming availability
    const year = film.release_date.slice(0, 4)
    const title = film.title
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
