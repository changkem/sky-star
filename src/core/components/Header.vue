<template>
  <header>
    <AButton type="primary">保存</AButton>
    <a-button>发布</a-button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="less" scoped>
header {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right bottom, #f02fc2, #6094ea);
}
</style>
