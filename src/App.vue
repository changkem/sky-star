<template>
  <Editor />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Editor from '@/core';

export default defineComponent({
  name: 'App',
  components: {
    Editor,
  },
});
</script>

<style lang="less" scoped>
.content {
  display: flex;
  min-height: 100vh;
}
.viewer {
  flex: 3;
  overflow: auto;
}
</style>
