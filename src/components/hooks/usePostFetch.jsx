import React, { useEffect, useState } from 'react'

const usePostFetch = (url, token, requestedData = {}, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestedData),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const responseData = await response.json();
                setData(responseData);
                setError(null);
            } catch (error) {
                setError(error.message);
                setData(null);
            }
            finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            setLoading(true);
            setError(null);
            setData(null);
        };
    }, dependencies)

    return { data, loading, error };
}

export default usePostFetch