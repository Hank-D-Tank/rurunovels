import React from 'react';

const Textarea = ({ placeholder, icon, animate = true, value, onChange, style }) => {
    return (
        <div className={animate ? "input-container" : "input-container no-input-animate"}>
            <textarea 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                style={style}
            />
            <div className="input-container-border"></div>
            <div className="input-container-icon">{icon}</div>
        </div>
    );
};

export default Textarea;
