import React from 'react';
import { Link } from 'react-router-dom';

const BtnPrimary = ({ children, to = "#", className = "btn-red", style, onClick }) => {
  return (
    onClick ? <button className={"btn " + className} style={style} onClick={onClick}>{children}</button> : <Link to={to} className={"btn " + className} style={style}>{children}</Link>
  );
};

export default BtnPrimary;
