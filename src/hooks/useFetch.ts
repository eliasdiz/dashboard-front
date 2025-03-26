import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (overrideOptions?: AxiosRequestConfig) => Promise<void>;
}

const useFetch = <T>(
  url: string,
  options: AxiosRequestConfig = {},
  immediate = true
): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (overrideOptions: AxiosRequestConfig = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<T> = await axios({
          url,
          ...options,
          ...overrideOptions,
        });
        console.log(response.data)
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, fetchData };
};

export default useFetch;
