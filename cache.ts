import { Cache, CacheType, SingleCache } from "./cacheData/cacheOpts";
import {
  addSingleMemoryCacheList,
  getMemoryCache,
  getSingleMemoryCache,
  getSingleMemoryCacheCons,
} from "./proxy/memoryProxy";
import { addSingleStorageCacheList } from "./proxy/storageProxy";

/**
 * 添加单个缓存，内存存在聚合一组缓存操作
 * @param cacheName
 * @param cacheId
 * @return true 代表缓存中已经存在或者已经获取到新数据了  false代表获取数据失败
 */
export const addSingleCache = async (cacheName: string, cacheId: string): Promise<boolean> => {
  //先判断是否存在这个缓存
  const singleCache: SingleCache = getSingleMemoryCache(cacheName, cacheId);
  //查看缓存中是否已经存在了
  if (singleCache !== null) return true;
  //获取整个cache
  const cache: Cache = getMemoryCache(cacheName);
  //加入半成品仓库
  cache.__newCacheIdList.push(cacheId);
  //判断半成品是不是第一个
  if (cache.__newCacheIdList.length !== 1)
    return await new Promise(reslove => cache.__newCacheResolveList.push(reslove));
  await ((): Promise<boolean> => new Promise(resolve => setTimeout(resolve, 0)))();
  //开始获取数据
  try {
    //先主动对半成品id列表去重
    const cacheIdList: string[] = Array.from(new Set(cache.__newCacheIdList));
    //获取数据
    const newSingleCacheList: SingleCache[] = await cache.getData(cacheIdList);
    if (cache.cacheType === CacheType.memory) addSingleMemoryCacheList(cacheName, newSingleCacheList);
    else if (cache.cacheType === CacheType.storage) addSingleStorageCacheList(cacheName, newSingleCacheList);
    else throw "类型错误";
  } finally {
    cache.__newCacheResolveList.forEach(resolve => resolve(true));
    cache.__newCacheResolveList.length = 0;
    cache.__newCacheIdList.length = 0;
  }
  return true;
};

export const getSingleCache = (cacheName: string, cacheId: string): SingleCache => {
  return getSingleMemoryCacheCons(cacheName, cacheId);
};
