import React from 'react'

const SkeletonStoryCard = ({ quantity = 1, hasChapters = true }) => {
    const cols = 12 / quantity
    const cards = Array(quantity).fill(0)
    return (
        <div className='row'>
            {cards.map((_, index) => (
                <div key={index} className={"col-md-" + cols}>
                    <div className={hasChapters ? "single-card skeleton-card" : "single-card single-card-no-chapter skeleton-card"}>
                        <div className="single-card-bg-image">
                        </div>
                        <div className="single-card-info">
                            {hasChapters && <div className="single-card-novel-released-chapter skeleton-content">
                                <p className='skeleton-paragraph'></p>
                                <p className='skeleton-paragraph'></p>
                            </div>}
                            <div className="single-card-novel-title">
                                <p className='skeleton-title'></p>
                            </div>
                            <div className="single-card-novel-description skeleton-content">
                                <p className='skeleton-paragraph'></p>
                                <p className='skeleton-paragraph'></p>
                            </div>
                            <div className="single-card-novel-genre">
                                <span className="skeleton-button"></span>
                                <span className="skeleton-button"></span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonStoryCard
