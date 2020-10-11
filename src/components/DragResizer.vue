<template>
  <div
    ref="resizerRef"
    class="resizer"
    :style="addPxSuffix(position)"
    @click="handleFocus"
    @dblclick="handleClick"
    @mouseenter="handleIn"
    @mouseleave="handleOut"
    @mousedown="handleDragStart"
    @dragstart.prevent=""
  >
    <slot />
    <div class="resize resize-wn" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-w" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-en" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-n" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-ws" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-s" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-es" :style="{ display: state.activity ? 'block' : 'none' }" />
    <div class="resize resize-e" :style="{ display: state.activity ? 'block' : 'none' }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { DRAGGING, FITED } from '@/constant/event';
import { mitt, randomStr, addPxSuffix } from '@/utils';
import { throttle } from 'lodash-es';

export default defineComponent({
  setup() {
    const resizerRef = ref<HTMLElement>();
    const position = reactive({
      top: 0,
      left: 0,
      width: 400,
      height: 200,
      transform: '',
    });
    const state = reactive({ activity: false, focus: false });

    const id = randomStr();
    const intialPos = { x: 0, y: 0 };
    const startPos = { x: 0, y: 0 };
    const startRect = { ...position, left: 0, top: 0 };
    let className = '';
    let dragging = false;

    const handleFocus = () => {
      state.focus = true;
    };

    const handleClick = () => {
      mitt.emit('click', id);
    };

    const handleIn = () => {
      state.activity = true;
    };

    const handleOut = () => {
      if (!state.focus) {
        state.activity = false;
      }
    };

    const handleDragStart = (e: MouseEvent) => {
      startPos.x = e.pageX;
      startPos.y = e.pageY;
      Object.assign(startRect, position);
      className = (e.target as HTMLElement).classList.value;
      dragging = true;
    };

    const handleDrag = (e: MouseEvent) => {
      if (!dragging) {
        return;
      }

      let left = startRect.left,
        top = startRect.top;

      if (className.endsWith('s')) {
        position.height = startRect.height + e.pageY - startPos.y;
      }
      if (className.endsWith('n')) {
        position.height = startRect.height + startPos.y - e.pageY;
        top = startRect.top - (startPos.y - e.pageY);
      }
      if (className.includes('-e')) {
        position.width = startRect.width + e.pageX - startPos.x;
      }
      if (className.includes('-w')) {
        position.width = startRect.width + startPos.x - e.pageX;
        left = startRect.left - (startPos.x - e.pageX);
      }

      if (!className.includes('resize')) {
        left = startRect.left - (startPos.x - e.pageX);
        top = startRect.top - (startPos.y - e.pageY);
      }

      if (position.width < 20 || position.height < 20) {
        position.width = Math.max(20, position.width);
        position.height = Math.max(20, position.height);
        return;
      }

      position.left = left;
      position.top = top;
    };

    const handleDragEnd = (e: MouseEvent) => {
      dragging = false;
      if (!state.focus) {
        return;
      }
      if (!className.includes('resize')) {
        startRect.left += e.pageX - startPos.x;
        startRect.top += e.pageY - startPos.y;
      }
      if (className.includes('-w')) {
        startRect.left += startRect.width - position.width;
      }
      if (className.endsWith('n')) {
        startRect.top += startRect.height - position.height;
      }
    };

    const documentClick = (e: MouseEvent) => {
      const inside = resizerRef.value!.contains(e.target as HTMLElement);
      state.focus = inside;
      state.activity = inside;
    };

    watch(position, () => {
      mitt.emit(DRAGGING, {
        id,
        x: intialPos.x + position.left,
        y: intialPos.y + position.top,
        width: position.width,
        height: position.height,
      });
    });

    mitt.on(FITED, (targetPos) => {
      console.log(targetPos);
    });

    document.addEventListener('mousedown', documentClick);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', documentClick);
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    });

    onMounted(() => {
      const { x, y } = resizerRef.value!.getBoundingClientRect();
      intialPos.x = x;
      intialPos.y = y;
    });

    return {
      state,
      resizerRef,
      position,
      addPxSuffix,
      handleIn,
      handleOut,
      handleClick,
      handleFocus,
      handleDragStart,
    };
  },
});
</script>

<style lang="less" scoped>
.resizer {
  position: relative;
}

.resize {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  // border-radius: 50%;
  box-sizing: border-box;
  border: 1px #000 solid;
  &-wn {
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
    cursor: nwse-resize;
  }
  &-w {
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
    cursor: ew-resize;
  }
  &-n {
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: ns-resize;
  }
  &-en {
    top: 0;
    left: 100%;
    transform: translate(-50%, -50%);
    cursor: nesw-resize;
  }
  &-e {
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
    cursor: ew-resize;
  }
  &-es {
    top: 100%;
    left: 100%;
    transform: translate(-50%, -50%);
    cursor: nwse-resize;
  }
  &-s {
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: ns-resize;
  }
  &-ws {
    top: 100%;
    left: 0;
    transform: translate(-50%, -50%);
    cursor: nesw-resize;
  }
}
</style>
