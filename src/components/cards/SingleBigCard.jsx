import React from 'react'
import BtnPrimary from '../buttons/BtnPrimary'
import { Link, useNavigate } from 'react-router-dom';

const SingleBigCard = ({ novelId, novelCoverImg, novelBackgroundImg = novelCoverImg, novelTitle, novelSynopsis, novelChapters, novelRating, novelVotes }) => {

    return (
        <div className="single-big-card">
            <div className="single-big-card-bg-image">
                <img src={novelCoverImg}
                    alt={"Cover Image Of " + novelTitle} />
            </div>
            <div className="single-big-card-info">
                <div className="single-big-card-novel-image">
                    <img src={novelBackgroundImg}
                        alt={"Background Image Of " + novelTitle} />
                </div>
                <div className="single-big-card-content">
                    <div className="single-big-card-novel-title">
                        <p style={{cursor: "pointer"}} ><Link to={'/about/' + novelId + '/'}> {novelTitle} </Link></p>
                    </div>
                    <div className="single-big-card-novel-description">
                        <p>{novelSynopsis}</p>
                    </div>
                    <div className="single-big-card-novel-chapter">
                        <p>Chapters : {novelChapters}</p>
                    </div>
                    <div className="single-big-card-novel-rating">
                        <p>{novelRating} ({novelVotes})</p>
                    </div>
                    <BtnPrimary to={'/about/' + novelId + '/'}>
                        Read Now
                    </BtnPrimary>
                </div>
            </div>
        </div>
    )
}

export default SingleBigCard