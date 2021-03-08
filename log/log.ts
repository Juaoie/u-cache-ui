import { Cache } from "../cacheData/cacheOpts";
import memoryCacheList from "../cacheData/memory";
import { memorySize } from "../cacheWatch/watch";
const cacheList: Cache[] = memoryCacheList.getAllCacheList();

const getCacheInfo = (): void => {
  const list = cacheList.map((cache: Cache) => ({
    "缓存名称": cache.cacheName,
    "缓存key名称": cache.cacheIdName,
    "缓存类型": cache.cacheType,
    "存活时长": cache.readLimitTime,
    "可读次数": cache.readLimitNumber,
    "缓存大小": memorySize(JSON.stringify(cache.getAllSingleCacheList())),
  }));
  console.table(list);
};
const getCache = (cacheName: string): Cache => {
  return cacheList.find(item => item.cacheName === cacheName);
};
export default {
  getCacheInfo,
  getCache,
};
