import React from 'react'
import textBg from "../../assets/text-bg.svg";

const Heading = ({ children }) => {
    return (
        <div className="heading" /* style={{background: `url(${textBg}) no-repeat`}} */>
            <img src={textBg} alt="" />
            <h2>{children}</h2>
        </div>
    )
}

export default Heading