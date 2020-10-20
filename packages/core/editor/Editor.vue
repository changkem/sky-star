<template>
  <div
    ref="editorRef"
    class="editor"
    @drop="handleDrop"
    @dragover.prevent="$event.dataTransfer.dropEffect = 'move'"
  >
    <Ruler v-if="state.border.width" :width="state.border.width" :height="state.border.height" />
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
      :id="item.id"
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
import { defineComponent, onMounted, reactive, ref, unref } from 'vue';
import { pick } from 'lodash-es';
import { mitt, addPxSuffix, LineTools, randomStr } from '../../utils';
import { CHOOSE_COMPONENT, COMP_INSTACE_PASSIVE, DRAGGING } from '../constant/event';
import { Ruler, DragResizer } from '../components';
import type { Rect } from '../../types';

type Element = { componentType: string; id: string } & Rect;

interface State {
  border: Record<typeof properties[number], number>;
  rules: Record<string, Partial<Rect>>;
  elements: Element[];
}

const lineTools = new LineTools();

const properties = ['left', 'right', 'top', 'bottom', 'width', 'height'] as const;

export default defineComponent({
  components: {
    Ruler,
    DragResizer,
  },
  setup() {
    const editorRef = ref();
    let componentType = 'button';
    const state = reactive<State>({ border: {} as State['border'], rules: {}, elements: [] });

    onMounted(() => {
      const el = unref(editorRef);
      const clientRect = el!.getBoundingClientRect();
      state.border = pick(clientRect, properties);
      lineTools.insertLine({
        instanceId: 'border',
        x: clientRect.left - 200,
        y: clientRect.top - 100,
        width: clientRect.width,
        height: clientRect.height,
      });
    });

    const handleDrop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const id = randomStr();
      lineTools.insertLine({
        instanceId: id,
        x: e.pageX - 200,
        y: e.pageY - 100,
        width: 100,
        height: 80,
      });
      state.elements.push({
        id,
        left: e.pageX - 200,
        top: e.pageY - 100,
        width: 100,
        height: 80,
        componentType,
      });
    };

    mitt.on(DRAGGING, (pos) => {
      lineTools.insertLine(pos);
      const [left, top] = lineTools.getNearlyLine(pos.instanceId);
      console.log(left, top);
      state.rules.top = {
        left: pos.x + pos.width / 2,
        top: top.y,
        height: pos.y - top.y,
      };
      state.rules.topL = {
        left: Math.min(left.x, top.x),
        top: top.y - 1,
        width: top.x < pos.x ? pos.x + pos.width - top.x : top.x - left.x,
      };
      state.rules.left = {
        left: left.x,
        top: pos.y + pos.height / 2,
        width: pos.x - left.x,
      };
      state.rules.leftL = {
        left: left.x - 1,
        top: top.y,
        height: pos.y + pos.height - top.y,
      };
      // state.rules.right = {
      //   left: pos.x + pos.width,
      //   top: pos.y + pos.height / 2,
      //   width: state.border.right - pos.x - pos.width,
      // };
      // state.rules.bottom = {
      //   left: pos.x + pos.width / 2,
      //   top: pos.y + pos.height,
      //   height: state.border.bottom - pos.y - pos.height,
      // };
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

    return { state, addPxSuffix, handleDrop, editorRef };
  },
});
</script>

<style lang="less" scoped>
.editor {
  position: relative;
  height: 100%;
  &::before {
    content: ' ';
    position: absolute;
    left: 50%;
    height: 100%;
    border-right: 1px #ccc dashed;
    transform: translateX(-50%);
    z-index: -1;
  }
  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    border-top: 1px #ccc dashed;
    transform: translateY(-50%);
    z-index: -1;
  }
}

.left,
.right,
.top,
.bottom,
.topL,
.leftL {
  position: absolute;
}
.left,
.right {
  height: 2px;
  background: purple;
}
.topL {
  width: 100%;
  height: 1px;
  background: blue;
}
.leftL {
  width: 1px;
  height: 100%;
  background: blue;
}
.top,
.bottom {
  width: 2px;
  background: purple;
}
</style>
