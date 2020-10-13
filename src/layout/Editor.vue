<template>
  <div
    class="editor"
    @drop="handleDrop"
    @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
  >
    <Ruler />
    <div v-for="(style, cls) in state.rules" :key="cls" :class="cls" :style="addPxSuffix(style)" />
    <DragResizer v-for="item in state.elements" :key="item" :inital-pos="item" :type="'button'">
      <div style="width: 100px; height: 80px; background: blue" />
    </DragResizer>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { pick } from 'lodash-es';
import { mitt, addPxSuffix } from '@/utils';
import { CHOOSE_COMPONENT, DRAGGING } from '@/constant/event';
import Ruler from '@/components/Ruler.vue';
import DragResizer from '@/components/DragResizer.vue';

interface State {
  border: Record<typeof properties[number], number>;
  rules: Record<string, Partial<Record<'left' | 'top' | 'right' | 'height' | 'width', number>>>;
  elements: Record<'left' | 'top' | 'height' | 'width', number>[];
}

const properties = ['left', 'right', 'top', 'bottom'] as const;

const positions: Record<'x' | 'y' | 'width' | 'height' | 'id', number>[] = [];

const updatePositions = (pos: typeof positions[number]) => {
  const index = positions.findIndex((p) => p.id === pos.id);
  if (index !== -1) {
    positions[index] = pos;
  } else {
    positions.push(pos);
  }
};

export default defineComponent({
  components: {
    Ruler,
    DragResizer,
  },
  setup() {
    const state = reactive<State>({ border: {} as State['border'], rules: {}, elements: [] });

    onMounted(() => {
      const el = document.querySelector('.editor');
      const clientRect = el!.getBoundingClientRect();
      state.border = pick(clientRect, properties);
    });

    const handleDrop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      state.elements.push({ left: e.x - 200, top: e.y - 116, width: 100, height: 80 });
    };

    mitt.on(DRAGGING, (pos) => {
      updatePositions(pos);
      // console.log(positions.sort((a, b) => a.x - b.x));
      state.rules.top = { left: pos.x + pos.width / 2, top: 100, height: pos.y - state.border.top };
      state.rules.left = { left: 0, top: pos.y + pos.height / 2, width: pos.x - 200 };
      state.rules.right = {
        left: pos.x + pos.width,
        top: pos.y + pos.height / 2,
        width: state.border.right - pos.x - pos.width,
      };
      state.rules.bottom = {
        left: pos.x + pos.width / 2,
        top: pos.y + pos.height,
        height: state.border.bottom - pos.y - pos.height,
      };
    });

    mitt.on(CHOOSE_COMPONENT, (params) => {
      console.log(params);
    });

    document.addEventListener('keyup', (e) => {
      console.log(e);
      if (e.keyCode === 27) {
        // escape;
      }
      if (e.keyCode === 8) {
        // delete;
      }
    });

    return { state, addPxSuffix, handleDrop };
  },
});
</script>

<style lang="less">
.editor {
  position: relative;
  height: 100%;
}
.left,
.right,
.top,
.bottom {
  position: absolute;
}
.left,
.right {
  height: 2px;
  background: purple;
}
.top,
.bottom {
  width: 2px;
  background: purple;
}
</style>
