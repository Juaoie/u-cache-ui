"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getSingleCache = exports.getSingleCacheExist = exports.getCache = exports.setCacheList = exports.addCache = exports.registeredCache = void 0;
var STORAGE_VERSION = "__cache__v1.0/";
//实例内得缓存列表
var cacheList = [];
//注册缓存
var registeredCache = function (options) {
    options.newCacheIdList = [];
    options.newCacheResolveList = [];
    options.cacheList = [];
    cacheList.push(options);
};
exports.registeredCache = registeredCache;
/**
 * 添加缓存
 * @param cacheName
 * @param cacheId
 * @return true 代表缓存中已经存在或者已经获取到数据了  false代表获取数据失败
 */
var addCache = function (cacheName, cacheId) { return __awaiter(void 0, void 0, void 0, function () {
    var cache, newCacheList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cache = exports.getCache(cacheName);
                //查看缓存中是否已经存在了
                if (exports.getSingleCacheExist(cacheName, cacheId))
                    return [2 /*return*/, true];
                //加入半成品仓库
                cache.newCacheIdList.push(cacheId);
                if (!(cache.newCacheIdList.length !== 1)) return [3 /*break*/, 2];
                return [4 /*yield*/, new Promise(function (reslove) { return cache.newCacheResolveList.push(reslove); })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, (function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); })()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, , 6, 7]);
                return [4 /*yield*/, cache.getData(Array.from(new Set(cache.newCacheIdList)))];
            case 5:
                newCacheList = _a.sent();
                exports.setCacheList(cacheName, newCacheList);
                return [3 /*break*/, 7];
            case 6:
                cache.newCacheResolveList.forEach(function (resolve) { return resolve(true); });
                cache.newCacheResolveList.length = 0;
                cache.newCacheIdList.length = 0;
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/, true];
        }
    });
}); };
exports.addCache = addCache;
/**
 * 设置缓存列表数据
 * @param cacheName
 * @param newCacheList
 */
var setCacheList = function (cacheName, newCacheList) {
    var _a;
    var cache = exports.getCache(cacheName);
    if (cache.cacheType === "memory")
        (_a = cache.cacheList).push.apply(_a, newCacheList);
    else if (cache.cacheType === "storage") {
        var cacheList_1 = uni.getStorageSync(STORAGE_VERSION + cacheName);
        cacheList_1
            ? uni.setStorageSync(STORAGE_VERSION + cacheName, cacheList_1.concat(newCacheList))
            : uni.setStorageSync(STORAGE_VERSION + cacheName, newCacheList);
    }
};
exports.setCacheList = setCacheList;
/**
 * 获取缓存
 * @param cacheName
 */
var getCache = function (cacheName) {
    var cache = cacheList.find(function (item) { return item.cacheName === cacheName; });
    if (cache === undefined)
        throw "缓存实例未注册";
    return cache;
};
exports.getCache = getCache;
/**
 * 查看单个缓存数据是否存在
 * @param cache
 * @param cacheId
 * @return false 代表缓存中不存在；true 代表缓存中存在
 */
var getSingleCacheExist = function (cacheName, cacheId) {
    var singleCache = exports.getSingleCache(cacheName, cacheId);
    return !!singleCache;
};
exports.getSingleCacheExist = getSingleCacheExist;
/**
 * 获取单个缓存数据
 * @param cacheName
 * @param cacheId
 */
var getSingleCache = function (cacheName, cacheId) {
    var cache = exports.getCache(cacheName);
    if (cache.cacheType === "memory")
        return cache.cacheList.find(function (item) { return item[cache.cacheIdName] === cacheId; }) || null;
    else if (cache.cacheType === "storage") {
        var storage = uni.getStorageSync(STORAGE_VERSION + cacheName);
        return storage ? storage.find(function (item) { return item[cache.cacheIdName] === cacheId; }) : null;
    }
    throw "缓存类型字段写入错误！";
};
exports.getSingleCache = getSingleCache;
