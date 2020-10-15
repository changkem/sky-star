<template>
  <div
    class="editor"
    @drop="handleDrop"
    @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
  >
    <Ruler />
    <div v-for="(style, cls) in state.rules" :key="cls" :class="cls" :style="addPxSuffix(style)" />
    <DragResizer
      v-for="item in state.elements"
      :key="item"
      :inital-client-rect="item"
      :editor-rect="state.border"
      :component-type="'button'"
    >
      <div style="width: 100%; height: 100%; background: blue" />
    </DragResizer>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { pick } from 'lodash-es';
import { mitt, addPxSuffix, LineTools } from '@/utils';
import { CHOOSE_COMPONENT, DRAGGING } from '@/constant/event';
import Ruler from '@/core/components/Ruler.vue';
import DragResizer from '@/core/components/DragResizer.vue';
import type { Rect } from '@/types';

type Element = { componentType: string } & Rect;

interface State {
  border: Record<typeof properties[number], number>;
  rules: Record<string, Partial<Rect>>;
  elements: Element[];
}

type Pos = {
  id: string;
  instanceId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

const lineTools = new LineTools();

const properties = ['left', 'right', 'top', 'bottom', 'width', 'height'] as const;

const horizontalPos: Pos[] = [];

const verticalPos: Pos[] = [];

const insertVertical = (pos: Pos) => {
  updatePositions(verticalPos, pos);
};

const insertHorizontal = (pos: Pos) => {
  updatePositions(horizontalPos, pos);
};

const updatePositions = (positions: Pos[], pos: Pos) => {
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
    let componentType = 'button';
    const state = reactive<State>({ border: {} as State['border'], rules: {}, elements: [] });

    onMounted(() => {
      const el = document.querySelector('.editor');
      const clientRect = el!.getBoundingClientRect();
      state.border = pick(clientRect, properties);
      state.border.top -= 100;
      lineTools.insertLine({
        instanceId: 'border',
        x: clientRect.left,
        y: clientRect.top,
        width: 0,
        height: clientRect.height,
      });
    });

    const handleDrop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      state.elements.push({
        left: e.pageX - 200,
        top: e.pageY - 100,
        width: 100,
        height: 80,
        componentType,
      });
    };

    mitt.on(DRAGGING, (pos) => {
      // updatePositions(pos);
      // console.log(positions.sort((a, b) => a.left - b.left));
      // console.log(positions.sort((a, b) => a.top - b.top));
      // console.log(positions.sort((a, b) => a.left + a.width - b.left ));
      // console.log(positions.sort((a, b) => a.left - b.left));
      state.rules.top = {
        left: pos.left + pos.width / 2,
        top: 0,
        height: pos.top - state.border.top,
      };
      state.rules.left = { left: 0, top: pos.top + pos.height / 2, width: pos.left };
      state.rules.right = {
        left: pos.left + pos.width,
        top: pos.top + pos.height / 2,
        width: state.border.right - pos.left - pos.width,
      };
      state.rules.bottom = {
        left: pos.left + pos.width / 2,
        top: pos.top + pos.height,
        height: state.border.bottom - pos.top - pos.height,
      };
    });

    mitt.on(CHOOSE_COMPONENT, (params) => {
      componentType = params.componentType;
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
