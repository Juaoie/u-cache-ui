import { SingleCache } from "../cacheData/cacheOpts";

let _getStorageSync = null;
let _setStorageSync = null;
if (window.hasOwnProperty("uni")) {
  //uniapp环境中
  _getStorageSync = uni.getStorageSync;
  _setStorageSync = uni.setStorageSync;
} else {
  //普通h5环境中
  _getStorageSync = (key: string): unknown => JSON.parse(localStorage.getItem(key));
  _setStorageSync = (key: string, value: unknown): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
}
export const getStorageSync = (key: string): SingleCache[] => {
  try {
    const storage = _getStorageSync(key);
    if (storage) return storage;
    else return null;
  } catch (error) {
    return null;
  }
};
export const setStorageSync = (key: string, value: unknown): boolean => {
  try {
    _setStorageSync(key, value);
    return true;
  } catch (error) {
    return false;
  }
};
