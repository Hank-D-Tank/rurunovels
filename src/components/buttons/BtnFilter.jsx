import React from 'react'
import { Link } from 'react-router-dom'

const BtnFilter = ({children, to="#", className="", onClick}) => {
  return (
    <Link to={to} className={className == "" ? 'btn btn-pill' : ('btn '+ className)} onClick={onClick}>{children}</Link>
  )
}

export default BtnFilter