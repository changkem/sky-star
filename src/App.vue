<template>
  <Header />
  <div class="content">
    <div class="viewer">
      <Editor></Editor>
    </div>
    <Operation />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Rect from './components/Rect.vue'
import Header from './layout/Header.vue'
import Editor from './layout/Editor.vue'
import Operation from './layout/Operation.vue'

export default defineComponent({
  name: 'App',
  components: {
    Rect,
    Editor,
    Header,
    Operation,
  },
})
</script>

<style lang="less" scoped>
.content {
  display: flex;
  min-height: 100vh;
}
.viewer {
  flex: 3;
}
</style>
