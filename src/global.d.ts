declare const uni: {
  /**
   * 从本地缓存中同步获取指定 key 对应的内容
   *
   * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=getstoragesync](http://uniapp.dcloud.io/api/storage/storage?id=getstoragesync)
   */
  getStorageSync(key: string): unknown;
  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
   *
   * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=setstoragesync](http://uniapp.dcloud.io/api/storage/storage?id=setstoragesync)
   */
  setStorageSync(key: string, value: unknown): void;
};
interface Window {
  cacheLog: unknown;
}
