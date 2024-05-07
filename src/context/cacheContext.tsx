import { createContext, useContext, ReactNode, useState } from 'react';

type CacheContextType = {
  getCache: (key: string) => any;
  setCache: (key: string, value: any, cacheTime: number) => void;
  deleteCache: (key: string) => any;
};

const CacheContext = createContext<CacheContextType | null>(null);

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

export function ContextCacheProvider({ children }: { children: ReactNode }) {
  const [cacheMap, setCacheMap] = useState<
    Map<string, { data: any; expireDate: Date }>
  >(new Map());

  function setCache(key: string, value: any, cacheTime: number = 50) {
    const expireTime = new Date();
    expireTime.setSeconds(expireTime.getSeconds() + cacheTime);
    const newCacheMap = new Map(cacheMap);
    newCacheMap.set(key, {
      expireDate: expireTime,
      data: value,
    });
    setCacheMap(newCacheMap);
  }

  function getCache(key: string) {
    const findCache = cacheMap.get(key);
    if (!findCache || new Date().getTime() > findCache.expireDate.getTime()) {
      return undefined;
    }
    return findCache.data;
  }

  function deleteCache(key: string) {
    const newCacheMap = new Map(cacheMap);
    newCacheMap.delete(key);
    setCacheMap(newCacheMap);
  }

  return (
    <CacheContext.Provider value={{ setCache, getCache, deleteCache }}>
      {children}
    </CacheContext.Provider>
  );
}
