import React from 'react'
import BtnPrimary from '../buttons/BtnPrimary'
import BtnSecondary from '../buttons/BtnSecondary'

const SingleDetailCard = ({ novelId, novelCoverImg, novelBackgroundImg = novelCoverImg, novelTitle, novelAuthor, novelChapters, novelStatus, novelRating, novelRatingPercent, novelVotes, novelViews, readingChapter, saveBtnEvent, saved, saving }) => {
    return (
        <div className="single-big-card single-big-details-card">
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
                        <p>{novelTitle}</p>
                    </div>
                    <div className="single-big-card-novel-info">
                        <p>
                            Author : <span>{novelAuthor}</span>
                        </p>
                        <p>
                            Chapters : <span>{novelChapters}</span>
                        </p>
                        <p>
                            Status : <span>{novelStatus}</span>
                        </p>
                    </div>
                    <div className="single-big-card-novel-rating">
                        <p className='d-flex align-items-center'><span className="rating me-2 mb-1"> <span style={{ width: novelRatingPercent }}></span> </span> {novelRating} ({novelVotes} votes)</p>
                        <p>{novelViews} Views</p>
                    </div>
                    <div className="single-card-action">
                        <BtnPrimary to={'/reading/' + novelId + '/' + readingChapter}> Read Now </BtnPrimary>
                        <BtnPrimary className={saving ? "btn-line-red p-0" : "btn-line-red"} onClick={saveBtnEvent} disabled={saving}>
                            {saving ? <div className="loader" style={{scale: "0.5"}}></div> : saved ? "Saved" : "Save"}
                        </BtnPrimary>
                    </div>
                    <div className="single-card-action">
                        <BtnSecondary> Submit A Report </BtnSecondary>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleDetailCard
