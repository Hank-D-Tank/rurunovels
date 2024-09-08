import React, { useState, useEffect } from 'react';
import { RxCross1 } from 'react-icons/rx';

const Multiselect = ({ genresList, initialSelectedGenres = [], placeholder = "Please Add Options", onChange, reset, onResetComplete }) => {
  const [selectedGenres, setSelectedGenres] = useState(initialSelectedGenres);

  useEffect(() => {
    if (initialSelectedGenres.length !== selectedGenres.length || 
        !initialSelectedGenres.every((val, index) => val === selectedGenres[index])) {
      setSelectedGenres(initialSelectedGenres);
    }
  }, [initialSelectedGenres]);

  useEffect(() => {
    if (reset) {
      setSelectedGenres([]);
      onResetComplete();
    }
  }, [reset]);

  useEffect(() => {
    if (onChange) {
      onChange(selectedGenres);
    }
  }, [selectedGenres]);

  const handleAddGenre = (genre) => {
    if (!selectedGenres.includes(genre)) {
      const newSelectedGenres = [...selectedGenres, genre];
      setSelectedGenres(newSelectedGenres);
    }
  };

  const handleRemoveGenre = (genre) => {
    const newSelectedGenres = selectedGenres.filter(g => g !== genre);
    setSelectedGenres(newSelectedGenres);
  };

  return (
    <div className="multiselect-container">
      <div className="selected-genres">
        {selectedGenres.length > 0 ? selectedGenres.map((genre, index) => (
          <div key={index} className={`badge ${genre.toLowerCase()}`}>
            {genre}
            <span className="remove-badge" onClick={() => handleRemoveGenre(genre)}><RxCross1 /></span>
          </div>
        )) : <p>{placeholder}</p>}
      </div>
      <div className="genres-list">
        {genresList.map((genre, index) => (
          <div key={index} className={`badge ${genre.toLowerCase()}`} onClick={() => handleAddGenre(genre)}>
            {genre}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Multiselect;
