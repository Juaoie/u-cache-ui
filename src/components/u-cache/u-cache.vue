<template>
  <div>
    <slot :extend="extend" :cache="cache"></slot>
  </div>
</template>

<script>
import { getSingleCache, addSingleCache } from "../../index";

export default {
  props: {
    /**
     * 缓存名称
     */
    cacheName: String,
    /**
     * 缓存id
     */
    cacheId: String,
    /**
     * 在小程序中作用域插槽直接使用页面的数据，所以需要通过组件继承
     */
    extend: Object,
  },
  data() {
    return { cache: {} };
  },
  watch: {
    cacheId: {
      async handler(cacheId) {
        if (!cacheId) return;
        await addSingleCache(this.cacheName, cacheId);
        this.cache = getSingleCache(this.cacheName, cacheId);
      },
      immediate: true,
    },
  },
};
</script>
