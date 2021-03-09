import memoryCacheList from "../cacheData/memory";
import { Cache, SingleCache } from "../cacheData/cacheOpts";

/**
 * 添加memory cache
 * @param cache
 * @returns
 */
export const addMemoryCache = (cache: Cache): boolean => {
  const isOk: boolean = memoryCacheList.addCache(cache);
  if (!isOk) throw `缓存名${cache.cacheName}的缓存在内存中已经存在了！请检查stroage和memory缓存是否一致`;
  //可能一个成功一个失败，需要添加事务，后续可以完善
  return memoryCacheList.addCache(cache);
};
/**
 * 获取memory cache
 * @param cacheName
 * @returns
 */
export const getMemoryCache = (cacheName: string): Cache => {
  return memoryCacheList.getCache(cacheName);
};
/**
 * 写入single memory cache
 * @param cacheName
 * @param singleCache
 * @returns
 */
export const addSingleMemoryCache = (cacheName: string, singleCache: SingleCache): boolean => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const _singleCache = _memoryCache.getSingleCache(<string>singleCache[_memoryCache.cacheIdName]);
  if (_singleCache !== null) return false;
  return _memoryCache.addSingleCache(singleCache);
};
/**
 * 批量写入single memory cache
 * @param cacheName
 * @param singleCacheList
 * @returns
 */
export const addSingleMemoryCacheList = (cacheName: string, singleCacheList: SingleCache[]): boolean[] => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const isOk: boolean[] = _memoryCache.addSingleCacheList(singleCacheList);
  return isOk;
};
/**
 * 获取single memory cache
 * @param cacheName
 * @param cacheId
 * @returns
 */
export const getSingleMemoryCache = (cacheName: string, cacheId: string): SingleCache => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const _singleCache = _memoryCache.getSingleCache(cacheId);
  //判断是否为空
  if (_singleCache === null) return null;
  //判断数据是否超时
  if (
    _memoryCache.readLimitTime !== 0 &&
    _singleCache._createTime + _memoryCache.readLimitTime < new Date().getTime()
  ) {
    _memoryCache.delSingleCache(cacheId);
    return null;
  }

  return _singleCache;
};

/**
 * 获取single memory cache，会消耗次数
 * @param cacheName
 * @param cacheId
 * @returns
 */
export const getSingleMemoryCacheCons = (cacheName: string, cacheId: string): SingleCache => {
  const _memoryCache = memoryCacheList.getCache(cacheName);
  const _singleCache = _memoryCache.getSingleCache(cacheId);
  //判断是否为空
  if (_singleCache === null) return null;
  //判断数据是否超时
  if (
    _memoryCache.readLimitTime !== 0 &&
    _singleCache._createTime + _memoryCache.readLimitTime < new Date().getTime()
  ) {
    _memoryCache.delSingleCache(cacheId);
    return null;
  }
  //判断是否超出读取次数了
  if (_memoryCache.readLimitNumber !== 0 && _singleCache._readNumber === 1) _memoryCache.delSingleCache(cacheId);
  else if (_memoryCache.readLimitNumber !== 0 && _singleCache._readNumber > 1) _singleCache._readNumber--;

  return _singleCache;
};
