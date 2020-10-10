<template>
  <div
    class="resizer"
    ref="resizerRef"
    v-bind:style="addPxSuffix(position)"
    @click="handleFocus"
    @mouseenter="handleIn"
    @mouseleave="handleOut"
    @mousedown="handleDragStart"
    @dragstart.prevent=""
  >
    <slot></slot>
    <div
      class="resize resize-wn"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-w"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-en"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-n"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-ws"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-s"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-es"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
    <div
      class="resize resize-e"
      v-bind:style="{ display: state.activity ? 'block' : 'none' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive, ref, watch } from "vue";

const addPxSuffix = (style: Record<string, string | number>) => {
  const clone = { ...style };
  Object.keys(clone).forEach((key) => {
    if (typeof clone[key] === "string") {
      return;
    }1
    clone[key] = `${clone[key]}px`;
  });
  return clone;
};

export default defineComponent({
  setup(a) {

    const resizerRef = ref<HTMLElement>();
    const position = reactive({
      top: 0,
      left: 0,
      width: 200,
      height: 200,
      transform: "",
    });
    const state = reactive({ activity: false, focus: false });

    const startPos = { x: 0, y: 0 };
    const startRect = { ...position, transformX: 0, transformY: 0 };
    let className = "";
    let dragging = false;

    const handleFocus = () => {
      state.focus = true;
    };

    const handleIn = () => {
      state.activity = true;
    };

    const handleOut = (e: MouseEvent) => {
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

      let transformX = startRect.transformX,
        transformY = startRect.transformY;

      if (className.endsWith("s")) {
        position.height = startRect.height + e.pageY - startPos.y;
      }
      if (className.endsWith("n")) {
        position.height = startRect.height + startPos.y - e.pageY;
        transformY = startRect.transformY - (startPos.y - e.pageY);
      }
      if (className.includes("-e")) {
        position.width = startRect.width + e.pageX - startPos.x;
      }
      if (className.includes("-w")) {
        position.width = startRect.width + startPos.x - e.pageX;
        transformX = startRect.transformX - (startPos.x - e.pageX);
      }

      if (!className.includes("resize")) {
        transformX = startRect.transformX - (startPos.x - e.pageX);
        transformY = startRect.transformY - (startPos.y - e.pageY);
      }

      if(position.width < 20 || position.height < 20) {
        position.width = Math.max(20, position.width);
        position.height = Math.max(20, position.height);
        return;
      }

      position.left = transformX;
      position.top = transformY;
    };

    const handleDragEnd = (e: MouseEvent) => {
      dragging = false;
      if(!state.focus) {
        return
      }
      if(!className.includes('resize')) {
          startRect.transformX += e.pageX - startPos.x;
          startRect.transformY += e.pageY - startPos.y;
      }
      if (className.includes("-w")) {
        startRect.transformX += startRect.width - position.width;
      }
      if (className.endsWith("n")) {
        startRect.transformY += startRect.height - position.height;
      }
    };

    const documentClick = (
      e: MouseEvent
    ) => {
      const inside = resizerRef.value!.contains(e.target as HTMLElement);
      state.focus = inside;
      state.activity = inside;
    };

    document.addEventListener("mousedown", documentClick);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    
    onBeforeUnmount(() => {
      document.removeEventListener("mousedown", documentClick);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    });

    return {
      state,
      resizerRef,
      position,
      addPxSuffix,
      handleIn,
      handleOut,
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
