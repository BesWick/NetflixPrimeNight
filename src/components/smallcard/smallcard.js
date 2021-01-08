import React, { useState } from 'react'
import './smallcard.css'

const baseImageUrl = 'https://image.tmdb.org/t/p/original/'

function SmallCard({ type, film }) {
    const [isHover, setHover] = useState(false)

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
            <div className='overlay'>Hello</div>
        </div>

        // insert img
        // if hover -> display overlay with following info: film type, title, year, streaming availability
        // if click -> go to its info page (seperate url)
    )
}

export default SmallCard
