import React, { useState, useRef, useEffect } from 'react';
import Loader from '../loaders/Loader';
import notFound from '../../assets/not-found.svg';

const Search = ({ inputValue, setInputValue, dataArr, className="" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [inputValue]);

  const handleContainerMouseDown = (e) => {
    e.preventDefault();
    inputRef.current.focus();
  };

  return (
    <div className={"search " + className}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search Novels..."
        onInput={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={isFocused && inputValue ? { borderBottomLeftRadius: "0", borderBottomRightRadius: "0" } : {}}
      />
      <div className={`search-container ${isFocused && inputValue ? 'active' : ''}`} style={dataArr.length > 0 || loading ? {} : { height: "20rem" }} onMouseDown={handleContainerMouseDown}>
        <div className="search-items">
          <div className="row">
            {loading ? (
              <div className="col-12" style={{height: "10rem"}}>
                <Loader style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", scale: "0.8" }}/>
              </div>
            ) : inputValue === "" ? null : (
              dataArr.length > 0 ? dataArr.map((item, index) => (
                <div className="col-12" key={index}>
                  {item}
                </div>
              )) : (
                <div className="col-12 not-found" style={{ marginLeft: "0", height: "19rem" }}>
                  <img src={notFound} alt="" style={{ scale: "0.3" }} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
