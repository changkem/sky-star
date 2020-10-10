<template>
  <div class="eidtor">
    <Rect v-bind:key="rect.id" v-for="rect in state.rects" />
    <slot></slot>
    <button @click="handleAdd">添加模块</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUpdated, reactive, watch } from 'vue'
import Rect from '../components/Rect.vue'
import { mitt } from '../main'
import { REAC_CREATED } from '@/constant/event'

export default defineComponent({
  components: {
    Rect,
  },
  setup() {
    const state = reactive<{ rects: { id: number }[] }>({ rects: [] })
    mitt.on(REAC_CREATED, () => {
      console.log(2333)
    })
    const handleAdd = () => {
      state.rects.push({ id: state.rects.length + 1 })
    }

    onUpdated(() => {
      console.log(document.querySelectorAll('.rect'))
    })

    return { state, handleAdd }
  },
})
</script>

<style lang="less"></style>
