import React from 'react'

const BtnSidebar = ({children, onClick}) => {
  return (
    
    <button className="btn-story-sidebar" onClick={onClick}>{children}</button>
  )
}

export default BtnSidebar