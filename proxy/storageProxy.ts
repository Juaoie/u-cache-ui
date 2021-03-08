import memoryCacheList from "../cacheData/memory";
import { Cache, SingleCache } from "../cacheData/cacheOpts";
import { getStorageSync, setStorageSync } from "../compatible/env";

/**
 * 添加storage cache
 * @param cache
 * @returns
 */
export const addStorageCache = (cache: Cache): boolean => {
  const _memoryCache = memoryCacheList.getCache(cache.cacheName);
  if (_memoryCache !== null)
    throw `缓存名${cache.cacheName}的缓存在内存中已经存在了！请检查stroage和memory缓存是否一致`;
  const _storageCacheList: SingleCache[] = getStorageSync(cache.cacheName);
  if (_storageCacheList?.length > 0) {
    cache.addSingleCacheList(_storageCacheList);
    return memoryCacheList.addCache(cache);
  }
  //可能一个成功一个失败，需要添加事务，后续可以完善
  //第一次写入执行
  if (memoryCacheList.addCache(cache) && setStorageSync(cache.cacheName, [])) return true;
  return false;
};

/**
 * 写入single storage cache
 * @param cacheName
 * @param singleCache
 * @returns
 */
export const addSingleStorageCache = (cacheName: string, singleCache: SingleCache): boolean => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const _singleCache = _memoryCache.getSingleCache(<string>singleCache[_memoryCache.cacheIdName]);
  if (_singleCache !== null) return false;
  if (_memoryCache.addSingleCache(singleCache) && setStorageSync(cacheName, _memoryCache.getAllSingleCacheList()))
    return true;
  return false;
};
/**
 * 批量写入single storage cache
 * @param cacheName
 * @param singleCacheList
 * @returns
 */
export const addSingleStorageCacheList = (cacheName: string, singleCacheList: SingleCache[]): boolean[] => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const isOk: boolean[] = _memoryCache.addSingleCacheList(singleCacheList);
  setStorageSync(cacheName, _memoryCache.getAllSingleCacheList());
  return isOk;
};
