import React from 'react'

const BtnAction = ({children, className="btn-red", style, onClick}) => {
  return (
    <button className={"btn " + className} style={style} onClick={onClick}>{children}</button>
  )
}

export default BtnAction