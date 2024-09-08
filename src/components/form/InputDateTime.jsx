import React, { useEffect, useState } from 'react';

const Input = ({ placeholder, icon, value, onChange, disabled = false }) => {
    const [minDateTime, setMinDateTime] = useState('');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedNow = `${year}-${month}-${day}T${hours}:${minutes}`;
        setMinDateTime(formattedNow);
    }, []);

    return (
        <div className={value ? "input-container no-input-animate input-custom-datetime" : "input-container no-input-animate input-custom-datetime active"}>
            {value ? null : <label>{placeholder}</label>}
            <input 
                type="datetime-local" 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
                min={minDateTime}
                style={value ? {opacity: 1} : {opacity: 0}}
            />
            <div className="input-container-border"></div>
            <div className="input-container-icon">{icon}</div>
        </div>
    );
};

export default Input;
