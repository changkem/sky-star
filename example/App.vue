<template>
  <Editor />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Editor from '../packages/core';

export default defineComponent({
  name: 'App',
  components: {
    Editor,
  },
});
</script>

<style lang="less" scoped></style>
