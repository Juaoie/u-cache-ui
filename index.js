import { CacheType } from "./cacheData/cacheOpts";
import { MemoryCacheFactory } from "./cacheData/memory";
import { addMemoryCache, getMemoryCache, addSingleMemoryCache, addSingleMemoryCacheList, getSingleMemoryCache, } from "./proxy/memoryProxy";
import { addStorageCache, addSingleStorageCache, addSingleStorageCacheList } from "./proxy/storageProxy";
import { addSingleCache, getSingleCache } from "./cache";
import cacheLog from "./log/log";
export { 
//memory
addMemoryCache, getMemoryCache, addSingleMemoryCache, addSingleMemoryCacheList, getSingleMemoryCache, 
//storage
addStorageCache, addSingleStorageCache, addSingleStorageCacheList, 
//cache
addSingleCache, getSingleCache, };
window.cacheLog = cacheLog;
export default class UCacheUi {
    constructor(cacheOptsList) {
        const cacheFactory = new MemoryCacheFactory();
        const cacheList = cacheFactory.makeMemoryCacheList(cacheOptsList);
        cacheList.forEach((cache) => {
            if (cache.cacheType === CacheType.storage)
                addStorageCache(cache);
            else if (cache.cacheType === CacheType.memory)
                addMemoryCache(cache);
            else
                throw "未指定cacheType";
        });
    }
}
