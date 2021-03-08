export interface CacheOpts {
  cacheName: string;
  cacheIdName: string;
  cacheType: CacheType;
  readLimitTime: number | 0;
  readLimitNumber: number | 0;
  getData(cacheIdList: string[]): Promise<never[]>;
}

export enum CacheType {
  memory = "memory",
  storage = "storage",
}
export interface SingleCache {
  [key: string]: unknown;
  /**
   * 这条缓存创建的时间
   */
  _createTime: number;
  /**
   * 这条缓存剩余读取次数
   */
  _readNumber: number;
}

export interface Cache {
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
   * 获取缓存数据的方法，需要用户自己实现
   * @param cacheIdList
   */
  getData(cacheIdList: string[]): Promise<SingleCache[]>;
  _singleCacheList: SingleCache[];
  singleCacheList: SingleCache[];

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
   * 获取singleCache数据
   * @param cacheId
   */
  getSingleCache(cacheId: string): SingleCache | null;
  /**
   * 获取所有singleCache
   */
  getAllSingleCacheList(): SingleCache[];
  /**
   *添加singleCache
   * @param singleCache
   */
  addSingleCache(singleCache: SingleCache): boolean;
  /**
   *批量添加singleCache
   * @param singleCache
   */
  addSingleCacheList(singleCacheList: SingleCache[]): boolean[];
  /**
   * 删除singleCache
   * @param cacheId
   */
  delSingleCache(cacheId: string): boolean;
}
export interface CacheList {
  /**
   * 获取内存缓存
   * @param cacheName
   */
  getCache(cacheName: string): Cache | null;
  /**
   * 添加memoryCache
   * @param cache
   * @returns
   */
  addCache(cache: Cache): boolean;
  /**
   * 设置内存缓存
   * @param cacheName
   * @param cache
   */
  setCache(cacheName: string, cache: Cache): boolean;
}
