import React from 'react';

const Input = ({ type = "text", placeholder, icon, animate = true, value, onChange, disabled = false }) => {
    return (
        <div className={animate ? "input-container" : "input-container no-input-animate"}>
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
            />
            <div className="input-container-border"></div>
            <div className="input-container-icon">{icon}</div>
        </div>
    );
};

export default Input;
