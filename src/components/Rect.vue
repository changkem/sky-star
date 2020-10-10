<template>
  <div class='rect'></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mitt } from '../main'
import { REAC_CREATED } from '../constant/event'

export default defineComponent({
  setup() {
    mitt.emit(REAC_CREATED)
  }
})
</script>

<style lang="less">
  .rect {
    height: 200px;
    border: 2px #ccc dashed;
  }
</style>