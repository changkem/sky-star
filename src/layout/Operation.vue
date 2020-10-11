<template>
  <div class="operation">
    <DragResizer>
      <div style="background: linear-gradient(to right bottom, #3a7bd5, #3a6073); height: 100%" />
    </DragResizer>
    <DragResizer>
      <div style="background: linear-gradient(to right bottom, #3a7bd5, #3a6073); height: 100%" />
    </DragResizer>
    <DragResizer>
      <div style="background: linear-gradient(to right bottom, #3a7bd5, #3a6073); height: 100%" />
    </DragResizer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DragResizer from '@/components/DragResizer.vue';
import { mitt } from '@/utils';

export default defineComponent({
  components: {
    DragResizer,
  },
  setup() {
    mitt.on('click', (id) => {
      console.log(id);
    });
    return {};
  },
});
</script>

<style lang="less" scoped>
.operation {
  flex: 1;
  min-width: 400px;
  background: #ccc;
}
</style>
