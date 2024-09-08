import React from 'react'

const CardWithBackground = ({ children, cardHeading, style }) => {
    return (
        <div className="card-with-heading card-with-heading-background" style={style}>
            {cardHeading && <div className="card-heading">{cardHeading}</div>}
            {children}
        </div>
    )
}

export default CardWithBackground