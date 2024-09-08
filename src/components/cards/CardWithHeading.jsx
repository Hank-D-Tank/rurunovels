import React from 'react'

const CardWithHeading = ({children, cardHeading, style, className = ""}) => {
    return (
        <div className={"card-with-heading " + className} style={style}>
            <div className="card-heading">{cardHeading}</div>
            {children}
        </div>
    )
}

export default CardWithHeading