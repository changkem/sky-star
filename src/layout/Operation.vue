<template>
  <div class="operation" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { mitt } from '@/utils';
import { COMP_INSTACE_ACTIVE } from '@/constant/event';

interface State {
  config: Record<string, {}>;
}

export default defineComponent({
  setup() {
    const { config } = reactive<State>({ config: {} });
    mitt.on(COMP_INSTACE_ACTIVE, (id) => {
      config[id] = {};
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
}
</style>
