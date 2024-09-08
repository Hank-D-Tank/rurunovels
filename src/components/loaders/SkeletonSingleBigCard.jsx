import React from 'react'

const SkeletonSingleBigCard = ({ }) => {
    return (
        <div className="single-big-card skeleton-card">
            <div className="single-big-card-bg-image">
            </div>
            <div className="single-big-card-info">
                <div className="single-big-card-novel-image skeleton-image">
                </div>
                <div className="single-big-card-content">
                    <div className="single-big-card-novel-title">
                        <p className=' skeleton-title'></p>
                    </div>
                    <div className="single-big-card-novel-description skeleton-content">
                        <p className='skeleton-paragraph'></p>
                        <p className='skeleton-paragraph'></p>
                        <p className='skeleton-paragraph'></p>
                    </div>
                    <div className="single-big-card-novel-chapter skeleton-content">
                        <p className='skeleton-paragraph' style={{width: "20%"}}></p>
                        <p className='skeleton-paragraph' style={{width: "20%"}}></p>
                    </div>
                    <div className="skeleton-button"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonSingleBigCard