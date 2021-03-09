import { setStorageSync } from "../compatible/env";
import { SingleCache, Cache, CacheList, CacheOpts, CacheType } from "./cacheOpts";

class MemoryCache implements Cache {
  /**
   * 缓存的名称
   */
  cacheName: string;
  /**
   * 缓存组件的id名称
   */
  cacheIdName: string;
  /**
   * 缓存类型
   */
  cacheType: CacheType;
  /**
   * 读取时长，时间戳，
   * 默认和0代表无限时长，内存缓存最长时长为堆内存数据存在时长
   */
  readLimitTime: number;
  /**
   * 读取次数
   * 默认为0，代表无限次数
   */
  readLimitNumber: number;
  /**
   * 准备添加的缓存id列表
   */
  __newCacheIdList: string[];
  /**
   * 准备执行的缓存Promise resolve列表
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  __newCacheResolveList: Function[];
  /**
   * 单个缓存数据列表
   */
  _singleCacheList: SingleCache[];
  get singleCacheList(): SingleCache[] {
    return this._singleCacheList;
  }
  set singleCacheList(singleCacheList: SingleCache[]) {
    if (this.cacheType === CacheType.storage) {
      setStorageSync(this.cacheName, singleCacheList);
    }
    this._singleCacheList = singleCacheList;
  }
  /**
   *构造器
   * @param cacheName
   * @param cacheType
   * @param cacheIdName
   * @param readLimitTime
   * @param singleCacheList
   */
  constructor(cacheOpts: CacheOpts) {
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
  getData(cacheIdList: string[]): Promise<SingleCache[]> {
    throw new Error("需实现getData方法" + cacheIdList.toString());
  }
  /**
   * 获取singleCache数据
   * @param cacheId
   */
  getSingleCache(cacheId: string): SingleCache | null {
    return this.singleCacheList.find(item => item[this.cacheIdName] === cacheId) || null;
  }
  /**
   * 获取所有singleCache
   * @returns
   */
  getAllSingleCacheList(): SingleCache[] {
    return this.singleCacheList;
  }
  /**
   *添加singleCache
   * @param singleCache
   */
  addSingleCache(singleCache: SingleCache): boolean {
    const _singleCache = this.getSingleCache(<string>singleCache[this.cacheIdName]);
    if (_singleCache !== null) return false;
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
  addSingleCacheList(singleCacheList: SingleCache[]): boolean[] {
    const isOk: boolean[] = singleCacheList.map((item: SingleCache) => this.addSingleCache(item));
    return isOk;
  }
  /**
   * 删除一个single cache
   * @param cacheId
   * @returns
   */
  delSingleCache(cacheId: string): boolean {
    const _singleCache = this.getSingleCache(cacheId);
    if (_singleCache === null) return false;
    this.singleCacheList = this.singleCacheList.filter(
      (item: SingleCache) => <string>item[this.cacheIdName] !== cacheId,
    );
    return true;
  }
}
export class MemoryCacheFactory {
  makeMemoryCacheList(cacheOptsList: CacheOpts[]): Cache[] {
    return cacheOptsList.map((cacheOpts: CacheOpts) => this.makeMemoryCache(cacheOpts));
  }
  makeMemoryCache(cacheOpts: CacheOpts): Cache {
    return new MemoryCache(cacheOpts);
  }
}
class MemoryCacheList implements CacheList {
  private memoryCacheList: MemoryCache[] = [];
  /**
   * 获取所有缓存列表
   * @returns
   */
  getAllCacheList(): MemoryCache[] {
    return this.memoryCacheList;
  }
  /**
   * 获取内存缓存
   * @param cacheName
   */
  getCache(cacheName: string): Cache | null {
    return this.memoryCacheList.find(item => item.cacheName === cacheName) || null;
  }
  /**
   * 添加memoryCache
   * @param cache
   * @returns
   */
  addCache(cache: Cache): boolean {
    const _memoryCache: Cache | null = this.getCache(cache.cacheName);
    if (_memoryCache !== null) return false;
    this.memoryCacheList.push(cache);
    return true;
  }
  /**
   * 设置内存缓存
   * @param cacheName
   * @param cache
   */
  setCache(cacheName: string, cache: Cache): boolean {
    const _memoryCache: Cache | null = this.getCache(cacheName);
    if (_memoryCache === null) return false;
    Object.assign(_memoryCache, cache);
    return true;
  }
}

/**
 * 初始化内存基础数据
 */
const memoryCacheList: MemoryCacheList = new MemoryCacheList();
export default memoryCacheList;
