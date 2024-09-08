import { useState, useEffect } from 'react';

const useFetch = (url, tokens = {}, otherParams = {}, dependencies = [], notFoundNeeded = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          ...otherParams.headers,
        };
        if (tokens.accessToken) {
          headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        const response = await fetch(url, {
          ...otherParams,
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        setData(responseData);
        setError(null);

        if (notFoundNeeded) {
          if (responseData.data.length === 0 && loading) {
            setNotFound(true);
            console.log("No data found");
          }
        }

      } catch (error) {
        setError(error.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setLoading(true);
      setNotFound(false);
      setData(null);
    };

  }, dependencies);

  return { data, loading, error, notFound };
};

export default useFetch;
