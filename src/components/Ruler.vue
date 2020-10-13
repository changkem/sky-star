<template>
  <div ref="ruleRef" class="ruler">
    <span v-for="(scale, index) in state.scales" :key="scale" class="scale">{{ (index + 1) * 100 }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, unref } from 'vue';

export default defineComponent({
  setup() {
    const ruleRef = ref<HTMLElement>();
    const state = reactive<{ scales: number[] }>({ scales: [] });
    onMounted(() => {
      const clientRect = unref(ruleRef)!.getBoundingClientRect();
      state.scales = new Array(Math.floor(clientRect.width / 100));
    });
    return { state, ruleRef };
  },
});
</script>

<style lang="less">
.ruler {
  width: 100%;
  height: 16px;
  display: flex;
}
.scale {
  border-right: 1px #000 solid;
  height: 8px;
  width: 99px;
  font-size: 14px;
}
</style>
