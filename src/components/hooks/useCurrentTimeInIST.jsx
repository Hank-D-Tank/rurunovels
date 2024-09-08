import { useState, useEffect } from 'react';

const getCurrentTimeInIST = () => {
    const offsetIST = 5.5 * 60 * 60 * 1000; // IST is +5:30 from UTC in milliseconds
    const currentTimeInMillis = Date.now();
    const currentTimeInIST = currentTimeInMillis + offsetIST;
    return new Date(currentTimeInIST).toISOString();
};

const useCurrentTimeInIST = () => {
    const [timeInIST, setTimeInIST] = useState(getCurrentTimeInIST());

    useEffect(() => {
        setTimeInIST(getCurrentTimeInIST());
    }, []);

    return timeInIST;
};

export default useCurrentTimeInIST;
