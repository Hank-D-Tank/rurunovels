import React, { useState, useEffect } from 'react';

const Autocomplete = ({ type = "text", placeholder, isLoading, data, icon, animate = true, value, onChange }) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onChange(value);

        if (value.length > 0) {
            const filteredSuggestions = data.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions(data);
        }
        setHighlightIndex(-1);
        setShowSuggestions(true); 
    };

    const handleFocus = (event) => {
        if (inputValue.length > 0) {
            event.target.select();
            const filteredSuggestions = data.filter(item =>
                item.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions(data);
        }
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!isLoading) {
                setShowSuggestions(false);
            }
        }, 100); // Delay to allow click event to register
    };

    const handleClick = (suggestion) => {
        setInputValue(suggestion);
        onChange(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setHighlightIndex(prevIndex =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            setHighlightIndex(prevIndex =>
                prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
            );
        } else if (e.key === 'Enter') {
            if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                handleClick(suggestions[highlightIndex]);
            }
        }
    };

    return (
        <div className={animate ? "input-container input-container-autocomplete" : "input-container input-container-autocomplete no-input-animate"}>
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
            <div className="input-container-icon">{icon}</div>
            {showSuggestions && (
                <div className="input-autocomplete">
                    {isLoading ? (
                        <div className="loader"></div>
                    ) : (
                        suggestions.length > 0 && suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`suggestion ${highlightIndex === index ? 'highlight' : ''}`}
                                onMouseDown={() => handleClick(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
