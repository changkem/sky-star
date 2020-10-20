<template>
  <div
    ref="resizerRef"
    :class="{ resizer: true, active: state.activity }"
    :style="addPxSuffix(clientRect)"
    @mouseenter="handleIn"
    @mouseleave="handleOut"
    @mousedown.prevent="handleDragStart"
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
import { defineComponent, onBeforeUnmount, PropType, reactive, ref, unref, watch } from 'vue';
import { DRAGGING, ADSORBED, COMP_INSTACE_ACTIVE, COMP_INSTACE_PASSIVE } from '../constant/event';
import { mitt, addPxSuffix, getRange } from '@/utils';
import type { ComponentType, Rect } from '@/types';

const emitDragging = (instanceId: string, clientRect: Rect) => {
  mitt.emit(DRAGGING, {
    instanceId,
    x: clientRect.left,
    y: clientRect.top,
    width: clientRect.width,
    height: clientRect.height,
  });
};

export default defineComponent({
  props: {
    id: {
      type: String as PropType<string>,
      default: '',
    },
    initalClientRect: {
      type: Object as PropType<Rect>,
      default: {},
    },
    editorRect: {
      type: Object as PropType<Record<'width' | 'height', number>>,
      default: {},
    },
    componentType: {
      type: String as PropType<ComponentType>,
      default: 'button',
    },
  },
  setup(props) {
    const resizerRef = ref<HTMLElement>();
    const clientRect = reactive({
      ...props.initalClientRect,
    });
    const state = reactive({ activity: false, focus: false });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { id } = props;
    const startInfo = { x: 0, y: 0, className: '', dragging: false };
    const startRect = { ...clientRect };

    let prevX = 0,
      prevY = 0;

    const handleIn = () => {
      state.activity = true;
    };

    const handleOut = () => {
      if (!state.focus) {
        state.activity = false;
      }
    };

    const handleDragStart = (e: MouseEvent) => {
      startInfo.x = e.x;
      startInfo.y = e.y;
      prevX = e.x;
      prevY = e.y;
      startInfo.className = (e.target as HTMLElement).classList.value;
      startInfo.dragging = true;
      state.focus = true;
      Object.assign(startRect, clientRect);
      emitDragging(id, clientRect);
      mitt.emit(COMP_INSTACE_ACTIVE, { id, componentType: props.componentType });
    };

    const handleDrag = (e: MouseEvent) => {
      if (!startInfo.dragging) {
        return;
      }
      const deltaX = e.x - startInfo.x,
        deltaY = e.y - startInfo.y;
      let left = startRect.left,
        top = startRect.top;

      // directionX = e.x - prevX > 0;
      // directionY = e.y - prevY > 0;

      if (startInfo.className.endsWith('s')) {
        clientRect.height = startRect.height + deltaY;
      }
      if (startInfo.className.endsWith('n')) {
        clientRect.height = startRect.height - deltaY;
        top = startRect.top + deltaY;
      }
      if (startInfo.className.includes('-e')) {
        clientRect.width = startRect.width + deltaX;
      }
      if (startInfo.className.includes('-w')) {
        clientRect.width = startRect.width - deltaX;
        left = startRect.left + deltaX;
      }

      if (!startInfo.className.includes('resize')) {
        left = startRect.left + deltaX;
        top = startRect.top + deltaY;
      }

      if (clientRect.width < 20 || clientRect.height < 20) {
        clientRect.width = Math.max(20, clientRect.width);
        clientRect.height = Math.max(20, clientRect.height);
        return;
      }

      clientRect.left = getRange(0, props.editorRect.width - clientRect.width, left);
      clientRect.top = getRange(0, props.editorRect.height, top);
    };

    const handleDragEnd = (e: MouseEvent) => {
      startInfo.dragging = false;
      if (!state.focus) {
        return;
      }
      if (!startInfo.className.includes('resize')) {
        startRect.left += e.x - startInfo.x;
        startRect.top += e.y - startInfo.y;
      }
      if (startInfo.className.includes('-w')) {
        startRect.left += startRect.width - clientRect.width;
      }
      if (startInfo.className.endsWith('n')) {
        startRect.top += startRect.height - clientRect.height;
      }
    };

    const documentClick = (e: MouseEvent) => {
      const inside = unref(resizerRef)!.contains(e.target as HTMLElement);
      state.focus = inside;
      state.activity = inside;
      if (inside === false) {
        mitt.emit(COMP_INSTACE_PASSIVE, true);
      }
    };

    watch(clientRect, () => {
      emitDragging(id, clientRect);
    });

    mitt.on(ADSORBED, (targetPos) => {
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

    return {
      state,
      resizerRef,
      clientRect,
      addPxSuffix,
      handleIn,
      handleOut,
      handleDragStart,
    };
  },
});
</script>

<style lang="less" scoped>
.resizer {
  position: absolute;
  box-sizing: border-box;
  &.active {
    border: 1px blue solid;
  }
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
