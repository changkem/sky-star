<template>
  <Header />
  <div class="content">
    <div class="viewer">
      <Editor />
    </div>
    <Operation />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './layout/Header.vue';
import Editor from './layout/Editor.vue';
import Operation from './layout/Operation.vue';

export default defineComponent({
  name: 'App',
  components: {
    Editor,
    Header,
    Operation,
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
