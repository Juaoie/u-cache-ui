import { setStorageSync } from "../compatible/env";
import { CacheType } from "./cacheOpts";
class MemoryCache {
    /**
     *构造器
     * @param cacheName
     * @param cacheType
     * @param cacheIdName
     * @param readLimitTime
     * @param singleCacheList
     */
    constructor(cacheOpts) {
        this.cacheName = cacheOpts.cacheName;
        this.cacheIdName = cacheOpts.cacheIdName;
        this.readLimitTime = cacheOpts.readLimitTime || 0;
        this.readLimitNumber = cacheOpts.readLimitNumber || 0;
        this.cacheType = cacheOpts.cacheType;
        this.getData = cacheOpts.getData;
        this.__newCacheIdList = [];
        this.__newCacheResolveList = [];
        this._singleCacheList = [];
    }
    get singleCacheList() {
        return this._singleCacheList;
    }
    set singleCacheList(singleCacheList) {
        if (this.cacheType === CacheType.storage) {
            setStorageSync(this.cacheName, singleCacheList);
        }
        this._singleCacheList = singleCacheList;
    }
    getData(cacheIdList) {
        throw new Error("需实现getData方法" + cacheIdList.toString());
    }
    /**
     * 获取singleCache数据
     * @param cacheId
     */
    getSingleCache(cacheId) {
        return this.singleCacheList.find(item => item[this.cacheIdName] === cacheId) || null;
    }
    /**
     * 获取所有singleCache
     * @returns
     */
    getAllSingleCacheList() {
        return this.singleCacheList;
    }
    /**
     *添加singleCache
     * @param singleCache
     */
    addSingleCache(singleCache) {
        const _singleCache = this.getSingleCache(singleCache[this.cacheIdName]);
        if (_singleCache !== null)
            return false;
        //写入当前时间
        singleCache._createTime = new Date().getTime();
        //写入剩余读取次数
        singleCache._readNumber = this.readLimitNumber;
        this.singleCacheList.push(singleCache);
        return true;
    }
    /**
     *批量添加singleCache
     * @param singleCacheList
     */
    addSingleCacheList(singleCacheList) {
        const isOk = singleCacheList.map((item) => this.addSingleCache(item));
        return isOk;
    }
    /**
     * 删除一个single cache
     * @param cacheId
     * @returns
     */
    delSingleCache(cacheId) {
        const _singleCache = this.getSingleCache(cacheId);
        if (_singleCache === null)
            return false;
        this.singleCacheList = this.singleCacheList.filter((item) => item[this.cacheIdName] !== cacheId);
        return true;
    }
}
export class MemoryCacheFactory {
    makeMemoryCacheList(cacheOptsList) {
        return cacheOptsList.map((cacheOpts) => this.makeMemoryCache(cacheOpts));
    }
    makeMemoryCache(cacheOpts) {
        return new MemoryCache(cacheOpts);
    }
}
class MemoryCacheList {
    constructor() {
        this.memoryCacheList = [];
    }
    /**
     * 获取所有缓存列表
     * @returns
     */
    getAllCacheList() {
        return this.memoryCacheList;
    }
    /**
     * 获取内存缓存
     * @param cacheName
     */
    getCache(cacheName) {
        return this.memoryCacheList.find(item => item.cacheName === cacheName) || null;
    }
    /**
     * 添加memoryCache
     * @param cache
     * @returns
     */
    addCache(cache) {
        const _memoryCache = this.getCache(cache.cacheName);
        if (_memoryCache !== null)
            return false;
        this.memoryCacheList.push(cache);
        return true;
    }
    /**
     * 设置内存缓存
     * @param cacheName
     * @param cache
     */
    setCache(cacheName, cache) {
        const _memoryCache = this.getCache(cacheName);
        if (_memoryCache === null)
            return false;
        Object.assign(_memoryCache, cache);
        return true;
    }
}
/**
 * 初始化内存基础数据
 */
const memoryCacheList = new MemoryCacheList();
export default memoryCacheList;
