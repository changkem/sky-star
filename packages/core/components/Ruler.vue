<template>
  <div class="ruler top">
    <span v-for="(scale, index) in topScales" :key="scale" class="scale">
      {{ (index + 1) * 100 }}
    </span>
    <span class="" />
  </div>
  <div class="ruler left">
    <span v-for="(scale, index) in heightScales" :key="scale" class="scale">
      {{ (index + 1) * 100 }}
    </span>
    <span class="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    width: {
      type: Number as PropType<number>,
      default: 0,
    },
    height: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props) {
    const topScales = new Array(Math.ceil(props.width / 100));
    const heightScales = new Array(Math.ceil(props.height / 100));

    return { topScales, heightScales };
  },
});
</script>

<style lang="less" scoped>
.ruler {
  position: absolute;
  width: 100%;
  height: 14px;
  display: flex;
  &.left {
    transform: rotate(90deg);
    transform-origin: 0 0;
    left: 14px;
  }
}
.scale {
  border-right: 1px #000 solid;
  height: 14px;
  min-width: 99px;
  font-size: 12px;
  line-height: 1.4;
}
</style>
