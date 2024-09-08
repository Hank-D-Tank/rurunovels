import React from 'react';

const CardRating = ({ ratings }) => {
  return (
    <div className="card-with-heading-rating">
      {ratings.map((rating, index) => (
        <p key={index}>
          {rating.type} <span className="rating"> <span style={{ width: `${rating.percentage}%` }}></span></span> {rating.percentage}%
        </p>
      ))}
    </div>
  );
};

export default CardRating;
