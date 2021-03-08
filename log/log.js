import memoryCacheList from "../cacheData/memory";
import { memorySize } from "../cacheWatch/watch";
const cacheList = memoryCacheList.getAllCacheList();
const getCacheInfo = () => {
    const list = cacheList.map((cache) => ({
        "缓存名称": cache.cacheName,
        "缓存key名称": cache.cacheIdName,
        "缓存类型": cache.cacheType,
        "存活时长": cache.readLimitTime,
        "可读次数": cache.readLimitNumber,
        "缓存大小": memorySize(JSON.stringify(cache.getAllSingleCacheList())),
    }));
    console.table(list);
};
const getCache = (cacheName) => {
    return cacheList.find(item => item.cacheName === cacheName);
};
export default {
    getCacheInfo,
    getCache,
};
