import { useState, useEffect } from 'react';

const useTimeFormat = (milliseconds) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const convertTime = (ms) => {
      if (ms === "" || ms === 0 || ms === null) {
        return '';
      }

      const now = Date.now();
      const diff = now - ms;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
      } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else if (days < 7) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      } else if (weeks < 4) {
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else if (months < 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
      } else {
        return `${years} year${years !== 1 ? 's' : ''} ago`;
      }
    };

    setFormattedTime(convertTime(milliseconds));
  }, [milliseconds]);

  return formattedTime;
};

export default useTimeFormat;
