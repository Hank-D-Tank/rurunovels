import React from 'react'

const MainContainer = ({children, style}) => {
  return (
    <div className="main-container" style={style}>
        {children}
    </div>
  )
}

export default MainContainer