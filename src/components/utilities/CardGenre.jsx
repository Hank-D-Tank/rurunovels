import React from 'react';

const CardGenre = ({ genres }) => {
    return (
        <div className="card-with-heading-genre">
            {genres.map((genre, index) => (
                <span key={index} className={`badge ${genre.toLowerCase().replace(/\s+/g, '-')}`}>
                    {genre}
                </span>
            ))}
        </div>
    );
}

export default CardGenre;
