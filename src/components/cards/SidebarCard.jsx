import React from 'react'
import { Link } from 'react-router-dom';

const SidebarCard = ({ novelId, novelCoverImg, novelTitle, novelGenre, novelRating, novelRatingPercent, novelVotes }) => {


    return (
        <div className="sidebar-card">
            <div className="sidebar-card-novel-image">
                <img src={novelCoverImg}
                    alt={"Cover Image Of " + novelTitle} />
            </div>
            <div className="sidebar-card-info">
                <div className="sidebar-card-novel-title">
                    <p style={{cursor: "pointer"}}> <Link to={'/about/' + novelId + '/'}> {novelTitle} </Link> </p>
                </div>
                <div className="sidebar-card-novel-genre">
                    <p>Genres: {novelGenre.map((genre, index) => (
                        <React.Fragment key={index}>
                            <Link to={'/library/filter?genre=' + genre}> {genre} </Link>
                            
                            {index !== novelGenre.length - 1 && ', '}
                        </React.Fragment>
                    ))}</p>
                </div>
                <div className="sidebar-card-novel-rating">
                <p className='d-flex align-items-center'><span className="rating me-2"> <span style={{ width: novelRatingPercent }}></span> </span> {novelRating} ({novelVotes} votes)</p>
                </div>
            </div>
        </div>
    )
}

export default SidebarCard