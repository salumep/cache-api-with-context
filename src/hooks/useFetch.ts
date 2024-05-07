import { useEffect, useState } from 'react';
import { useCache } from '../context/cacheContext';

type FetchTypeData<T> = {
  queryFn: () => Promise<T>;
  key: string;
  cache: Cache;
};

type Cache = {
  enable: boolean;
  cacheTime: number;
};

function useFetch<T>({ queryFn, key, cache }: FetchTypeData<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [fromCache, setFromCache] = useState(false); // Flag to indicate if data is from cache
  const { setCache, getCache } = useCache();

  const fetchData = async (forceServerFetch: boolean = false) => {
    setIsLoading(true);

    if (!forceServerFetch && getCache(key) !== undefined && cache.enable) {
      setData(getCache(key));
      setIsLoading(false);
      setFromCache(true); // Set flag to true if data is from cache
      return;
    }

    try {
      const responseData = await queryFn();
      setCache(key, responseData, cache.cacheTime);
      setData(responseData);
      setFromCache(false); // Set flag to false if data is fetched from server
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch, fromCache };
}

export default useFetch;
