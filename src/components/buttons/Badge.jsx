import React from 'react'

const Badge = ({className, children}) => {
  return (
    <span className={`badge ${className}`}>{children}</span>
  )
}

export default Badge