const STORAGE_VERSION: string = "__cache__v1.0/";
/**
 注册缓存
 cacheName 缓存名称
 cacheType 缓存类型
    memory    内存缓存，默认
    storage   storage缓存
  cacheTime 缓存时长，毫秒时间戳，默认不填永久
  cacheIdName 缓存id的名称
  getData   获取数据方法
  cacheList     缓存数据列表，列表中必须包含cacheIdName字段
 */
interface CacheOpts {
  cacheName: string;
  cacheIdName: string;
  getData(cacheIdList: Array<string>): Promise<Array<any>>;
  cacheType: "memory" | "storage";
  cacheTime?: number;
  newCacheIdList?: Array<string>; //准备更新的缓存id列表
  newCacheResolveList?: Array<any>; //准备恒星的缓存Promise resolve列表
  cacheList?: Array<any>;
}

//实例内得缓存列表
const cacheList: Array<CacheOpts> = [];
//注册缓存
export const registeredCache = (options: CacheOpts): void => {
  options.newCacheIdList = [];
  options.newCacheResolveList = [];
  options.cacheList = [];
  cacheList.push(options);
};
/**
 * 添加缓存
 * @param cacheName
 * @param cacheId
 * @return true 代表缓存中已经存在或者已经获取到数据了  false代表获取数据失败
 */
export const addCache = async (cacheName: string, cacheId: string): Promise<boolean> => {
  //先判断是否存在这个缓存
  const cache: CacheOpts = getCache(cacheName);
  //查看缓存中是否已经存在了
  if (getSingleCacheExist(cacheName, cacheId)) return true;
  //加入半成品仓库
  cache.newCacheIdList.push(cacheId);
  //判断半成品是不是第一个
  if (cache.newCacheIdList.length !== 1) return await new Promise(reslove => cache.newCacheResolveList.push(reslove));
  await ((): Promise<boolean> => new Promise(resolve => setTimeout(resolve, 0)))();
  //开始获取数据
  try {
    const newCacheList = await cache.getData(Array.from(new Set(cache.newCacheIdList)));
    setCacheList(cacheName, newCacheList);
  } finally {
    cache.newCacheResolveList.forEach(resolve => resolve(true));
    cache.newCacheResolveList.length = 0;
    cache.newCacheIdList.length = 0;
  }
  return true;
};
/**
 * 设置缓存列表数据
 * @param cacheName
 * @param newCacheList
 */
export const setCacheList = (cacheName: string, newCacheList: Array<any>): void => {
  const cache: CacheOpts = getCache(cacheName);
  if (cache.cacheType === "memory") cache.cacheList.push(...newCacheList);
  else if (cache.cacheType === "storage") {
    const cacheList = uni.getStorageSync(STORAGE_VERSION + cacheName);
    cacheList
      ? uni.setStorageSync(STORAGE_VERSION + cacheName, cacheList.concat(newCacheList))
      : uni.setStorageSync(STORAGE_VERSION + cacheName, newCacheList);
  }
};
/**
 * 获取缓存
 * @param cacheName
 */
export const getCache = (cacheName: string): CacheOpts => {
  const cache: CacheOpts | undefined = cacheList.find((item: CacheOpts) => item.cacheName === cacheName);
  if (cache === undefined) throw "缓存实例未注册";
  return cache;
};

/**
 * 查看单个缓存数据是否存在
 * @param cache
 * @param cacheId
 * @return false 代表缓存中不存在；true 代表缓存中存在
 */
export const getSingleCacheExist = (cacheName: string, cacheId: string): boolean => {
  const singleCache: any = getSingleCache(cacheName, cacheId);
  return !!singleCache;
};
/**
 * 获取单个缓存数据
 * @param cacheName
 * @param cacheId
 */
export const getSingleCache = (cacheName: string, cacheId: string): any => {
  const cache: CacheOpts = getCache(cacheName);
  if (cache.cacheType === "memory") return cache.cacheList.find(item => item[cache.cacheIdName] === cacheId) || null;
  else if (cache.cacheType === "storage") {
    const storage = uni.getStorageSync(STORAGE_VERSION + cacheName);
    return storage ? storage.find(item => item[cache.cacheIdName] === cacheId) : null;
  }
  throw "缓存类型字段写入错误！";
};
