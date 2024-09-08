import React from 'react'

const SkeletonSingleDetailCard = () => {
  return (
    <div className="single-big-card single-big-details-card skeleton-card">
            <div className="single-big-card-bg-image">
            </div>
            <div className="single-big-card-info">
                <div className="single-big-card-novel-image skeleton-image">
                </div>
                <div className="single-big-card-content">
                    <div className="single-big-card-novel-title">
                        <p className=' skeleton-title'></p>
                    </div>
                    <div className="single-big-card-novel-description skeleton-content" style={{marginTop: "1rem"}}>
                        <p className='skeleton-paragraph' style={{width: "50%"}}></p>
                    </div>
                    <div className="single-big-card-novel-chapter skeleton-content">
                        <p className='skeleton-paragraph' style={{width: "40%"}}></p>
                        <p className='skeleton-paragraph' style={{width: "20%"}}></p>
                    </div>
                    <div className="skeleton-content d-flex flex-row mt-auto mb-5">
                        <div className="skeleton-button"></div>
                        <div className="skeleton-button"></div>
                    </div>
                    <div className="single-big-card-novel-chapter skeleton-content">
                        <p className='skeleton-paragraph' style={{width: "20%"}}></p>

                        
                        
                    </div>
                </div>
            </div>
        </div>
  )
}

export default SkeletonSingleDetailCard

