import React from 'react'
import { Link } from 'react-router-dom'

const BtnSecondary = ({children, to="#", className="text-btn"}) => {
  return (
    <Link to={to} className={className}>{children}</Link>
  )
}

export default BtnSecondary