import React from 'react'
import Heading from './Heading'
import BtnAction from '../buttons/BtnAction'

const SectionHeading = ({children, heading, link="#", haveButtons=false}) => {
  return (
    <div className="section-heading">
        <Heading>{heading}</Heading>
        {haveButtons && children }   
    </div>
  )
}

export default SectionHeading