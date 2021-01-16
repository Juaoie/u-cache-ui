<template>
  <div>
    <slot :cache="cache"></slot>
  </div>
</template>

<script>
import { addCache, getSingleCache } from "../../index";

export default {
  props: {
    cacheId: String,
    cacheName: String,
  },
  data() {
    return { cache: null };
  },
  watch: {
    cacheId: {
      async handler(cacheId) {
        if (!cacheId) return;
        await addCache(this.cacheName, cacheId);
        this.cache = getSingleCache(this.cacheName, cacheId);
      },
      immediate: true,
    },
  },
};
</script>
