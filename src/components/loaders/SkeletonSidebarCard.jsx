import React from 'react'

const SkeletonSidebarCard = ({quantity = 1, size = 12}) => {
    const cols = 12 / quantity
    const cards = Array(quantity).fill(0)
    return (
        <>
            {cards.map((_, index) => <div className={'col-' + size} key={index}>
                <div className="sidebar-card skeleton-card">
                    <div className="sidebar-card-novel-image skeleton-image">
                    </div>
                    <div className="sidebar-card-info">
                        <div className="sidebar-card-novel-title">
                            <p className=' skeleton-title'></p>
                        </div>
                        <div className="sidebar-card-novel-genre">
                            <p className='skeleton-paragraph'></p>
                        </div>
                        <div className="sidebar-card-novel-rating">
                            <p className='skeleton-paragraph'></p>
                        </div>
                    </div>
                </div>
            </div>)}
        </>

    )
}

export default SkeletonSidebarCard