import { useEffect, useState } from "react";

import axios from "axios";
import useHandleApiError from "./useHandleApiError";

const useFetch = (url, token) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = token
          ? await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await axios.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        handleApiError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url, token]);

  return { data, loading };
};

export default useFetch;
