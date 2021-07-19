# u-cache-ui

- uniapp 的缓存列表组件

[点击查看技术细节](https://blog.csdn.net/qq_42363495/article/details/110738092)

## 一、功能特点

- 主要功能：解决多个接口同时返回数组对象，且需要通过唯一键或者多键组合拼接的情况，使用 u-cache-ui 将只用负责一个接口返回的数组对象直接渲染出来即可，其余的接口返回的数组对象将可以直接通过组件获取到并渲染出来；这里将优先从缓存中读取数据，否则将最小量请求接口；
- 缓存功能：可以对频繁请求的列表数据进行缓存，可以选择使用持久化缓存或者内存缓存；即使使用持久化缓存也不用担心从硬盘中读取速度过慢，因为 u-cache-ui 会在初始化时候对持久化数据进行内存代理访问，也就是说用户将不会直接从硬盘读取数据，而是从内存中读取；
- 日志监控功能：即使把所有列表数据都交给 u-cache-ui 管理，也不用担心数据存储在内存中看不到获取内存被占满；u-cache-ui 提供了很方便查看内存数据功能和实时监控内存情况功能；
- 热点数据功能：对于庞大的列表数据，也不用担心内存问题，u-cache-ui 提供丰富缓存时间配置和完整的数据生命周期，可以保证缓存到内存中的数据都是高频热点数据
- 数据格式的兼容功能：即使后台 api 返回的都是奇奇怪怪的数据，或则各种奇葩的数组对象组合方式，（例如：多对多？或者是通过多个组合 key 合并数据）u-cache-ui 都提供丰富组合配置和自定义数据返回

---

## 二、使用方法

```javascript
const cache = [
  {
    cacheName: "material",
    cacheIdName: "materialId",
    cacheType: "storage",
    readLimitTime: 0,
    readLimitNumber: 0,
    getData: async materialIdList => {
      return await fetch("https://uaoie.top/getMaterialList", {
        method: "GET",
        body: materialIdList,
      });
    },
  },
];
import UCache from "u-cache-ui";
new UCache(cache);
```

---

## 三、详细配置

_全部配置_

### 参数 object

| 名称            | 类型                      | 是否必填 | 默认值 | 说明                                      |
| --------------- | ------------------------- | -------- | ------ | ----------------------------------------- |
| cacheName       | string                    | true     |        | 缓存名称                                  |
| cacheIdName     | string \| array \| objcet | true     |        | 缓存 id 名称                              |
| cacheType       | "memory" \| "storage"     | true     |        | 缓存类型                                  |
| readLimitTime   | number                    | false    | 0      | 存活时长，0 代表不限时长                  |
| readLimitNumber | number                    | false    | 0      | 可读取次数，0 代表不限次数                |
| getData         | function                  | true     |        | 调用列表的接口方法，返回 Promise<never[]> |

### 参数 object.cacheIdName

_cacheIdName 类型为 string 表示单个 key 简单合并_

_cacheIdName 类型为 array 表示多个 key 简单合并_

_cacheIdName 类型为 object 表示多个 key 复杂合并，参数如下：_

| 名称   | 类型          | 是否必选 | 默认值 | 说明                           |
| ------ | ------------- | -------- | ------ | ------------------------------ |
| name   | string\|array | true     |        | 合并的关键字，可以是多个 key   |
| every  | boolead       | false    | false  | 是否匹配所有关键字             |
| filter | string\|array | false    | []     | 需要在 data 中过滤不合并的字段 |

---

## 四、api

### 4.1、cacheLog.getCacheInfo()

_可在控制台执行_

#### 返回值

| 名称          | 类型                  | 说明                                                                               |
| ------------- | --------------------- | ---------------------------------------------------------------------------------- |
| 缓存名称      | string                |
| 缓存 key 名称 | string                | 数据关联 key                                                                       |
| 缓存类型      | "memory" \| "storage" | 内存缓存或者持久化缓存                                                             |
| 存活时长      | number                | 读取时长，时间戳， 默认和 0 代表无限时长，内存缓存最长时长为堆内存数据实际存在时长 |
| 可读次数      | number                | 读取次数 默认为 0，代表无限次数                                                    |
| 缓存大小      | string                | 使用 kb 或者 mb 表示                                                               |

### 4.2、cacheLog.getCache()

_可在控制台执行_

#### 参数

_string cacheName 缓存名称_

## 五、其他 api

- `addMemoryCache` //添加内存缓存实例对象
- `getMemoryCache` //获取内存缓存实例对象
- `addSingleMemoryCache` //添加单个内存缓存数据
- `addSingleMemoryCacheList` //添加单个内存缓存数据列表
- `getSingleMemoryCache` //获取单个内存缓存
- `addStorageCache` // 添加硬盘缓存实例对象
- `addSingleStorageCache` //添加单个硬盘缓存数据
- `addSingleStorageCacheList` //添加单个硬盘缓存数据列表
- `addSingleCache` //添加单个缓存实例
- `getSingleCache` //获取单个缓存实例
