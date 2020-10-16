<template>
  <div
    class="editor"
    @drop="handleDrop"
    @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
  >
    <Ruler />
    <div>
      <div
        v-for="(style, cls) in state.rules"
        :key="cls"
        :class="cls"
        :style="addPxSuffix(style)"
      />
    </div>
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
import { CHOOSE_COMPONENT, COMP_INSTACE_PASSIVE, DRAGGING } from '@/constant/event';
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
      lineTools.insertLine({
        instanceId: 'border',
        x: clientRect.left - 200,
        y: clientRect.top - 100,
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
      lineTools.insertLine(pos);
      console.log(lineTools.getNearlyLine(pos.instanceId));
      state.rules.top = {
        left: pos.x + pos.width / 2,
        top: 0,
        height: pos.y - state.border.top,
      };
      state.rules.left = { left: 0, top: pos.y + pos.height / 2, width: pos.x };
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
      componentType = params.componentType;
    });

    mitt.on(COMP_INSTACE_PASSIVE, () => {
      state.rules = {};
    });

    document.addEventListener('keyup', (e) => {
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
