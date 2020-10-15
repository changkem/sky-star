<template>
  <Header />
  <div class="content">
    <Components />
    <div class="viewer">
      <Editor />
    </div>
    <Operation />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/core/Header.vue';
import Editor from '@/core/editor/Editor.vue';
import Operation from '@/core/editor/Operation.vue';
import Components from '@/core/editor/Components.vue';

export default defineComponent({
  name: 'App',
  components: {
    Editor,
    Header,
    Operation,
    Components,
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
