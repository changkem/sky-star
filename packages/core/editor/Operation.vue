<template>
  <div class="operation">
    <a-button>233</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { mitt } from '@/utils';
import { COMP_INSTACE_ACTIVE } from '../constant/event';

interface State {
  config: Record<string, unknown>;
}

export default defineComponent({
  setup() {
    const { config } = reactive<State>({ config: {} });
    mitt.on(COMP_INSTACE_ACTIVE, ({ id, componentType }) => {
      config[id] = { componentType };
      console.log(id, config);
    });
    return {};
  },
});
</script>

<style lang="less" scoped>
.operation {
  flex: 1;
  max-width: 400px;
  border: 1px #ccc solid;
}
</style>
