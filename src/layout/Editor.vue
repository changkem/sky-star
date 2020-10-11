<template>
  <div class="editor">
    <Ruler />
    <div v-for="(style, cls) in state.rules" :key="cls" :class="cls" :style="addPxSuffix(style)" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { pick } from 'lodash-es';
import { mitt, addPxSuffix } from '@/utils';
import { DRAGGING } from '@/constant/event';
import Ruler from '@/components/Ruler.vue';

interface State {
  border: Record<typeof properties[number], number>;
  rules: Record<string, Partial<Record<'left' | 'top' | 'right' | 'height' | 'width', number>>>;
}

const properties = ['left', 'right', 'top', 'bottom'] as const;

const positions: Record<typeof properties[number] | 'id', number>[] = [];

const updatePositions = (pos: any) => {
  const index = positions.findIndex(p => p.id === pos.id)
  if(index !== -1) {
    positions[index] = pos;
  } else {
    positions.push(pos)
  }
}

export default defineComponent({
  components: {
    Ruler,
  },
  setup() {
    const state = reactive<State>({ border: {} as State['border'], rules: {} });

    onMounted(() => {
      const el = document.querySelector('.editor');
      const clientRect = el!.getBoundingClientRect();
      state.border = pick(clientRect, properties);
    });

    mitt.on(DRAGGING, (pos) => {
      updatePositions(pos);
      console.log(positions.sort((a, b) => a.left - b.left))
      state.rules.top = { left: pos.x + pos.width / 2, top: 100, height: pos.y - state.border.top };
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

    return { state, addPxSuffix };
  },
});
</script>

<style lang="less">
.editor {
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
