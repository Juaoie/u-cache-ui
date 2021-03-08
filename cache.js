var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CacheType } from "./cacheData/cacheOpts";
import { addSingleMemoryCacheList, getMemoryCache, getSingleMemoryCache, getSingleMemoryCacheCons, } from "./proxy/memoryProxy";
import { addSingleStorageCacheList } from "./proxy/storageProxy";
/**
 * 添加单个缓存，内存存在聚合一组缓存操作
 * @param cacheName
 * @param cacheId
 * @return true 代表缓存中已经存在或者已经获取到新数据了  false代表获取数据失败
 */
export const addSingleCache = (cacheName, cacheId) => __awaiter(void 0, void 0, void 0, function* () {
    //先判断是否存在这个缓存
    const singleCache = getSingleMemoryCache(cacheName, cacheId);
    //查看缓存中是否已经存在了
    if (singleCache !== null)
        return true;
    //获取整个cache
    const cache = getMemoryCache(cacheName);
    //加入半成品仓库
    cache.__newCacheIdList.push(cacheId);
    //判断半成品是不是第一个
    if (cache.__newCacheIdList.length !== 1)
        return yield new Promise(reslove => cache.__newCacheResolveList.push(reslove));
    yield (() => new Promise(resolve => setTimeout(resolve, 0)))();
    //开始获取数据
    try {
        //先主动对半成品id列表去重
        const cacheIdList = Array.from(new Set(cache.__newCacheIdList));
        //获取数据
        const newSingleCacheList = yield cache.getData(cacheIdList);
        if (cache.cacheType === CacheType.memory)
            addSingleMemoryCacheList(cacheName, newSingleCacheList);
        else if (cache.cacheType === CacheType.storage)
            addSingleStorageCacheList(cacheName, newSingleCacheList);
        else
            throw "类型错误";
    }
    finally {
        cache.__newCacheResolveList.forEach(resolve => resolve(true));
        cache.__newCacheResolveList.length = 0;
        cache.__newCacheIdList.length = 0;
    }
    return true;
});
export const getSingleCache = (cacheName, cacheId) => {
    return getSingleMemoryCacheCons(cacheName, cacheId);
};
