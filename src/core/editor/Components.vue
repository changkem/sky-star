<template>
  <div class="components">
    <div
      draggable="true"
      class="component-wrapper"
      @dragstart="handleDragStart('button', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mitt } from '@/utils';
import { CHOOSE_COMPONENT } from '@/constant/event';

export default defineComponent({
  setup() {
    const handleDragStart = (componentType: string, e: DragEvent) => {
      const clientRect = (e.target as HTMLElement).getBoundingClientRect();
      mitt.emit(CHOOSE_COMPONENT, {
        componentType,
        offsetX: e.pageX - clientRect.x,
        offsetY: e.pageY - clientRect.y,
      });
    };
    return { handleDragStart };
  },
});
</script>

<style lang="less" scoped>
.components {
  width: 200px;
  border: 1px #ccc solid;
}
.component-wrapper {
  background: linear-gradient(to right bottom, #3a7bd5, #3a6073);
  height: 50px;
  width: 100px;
}
</style>
