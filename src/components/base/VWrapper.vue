<script setup lang="ts">
import { defineProps, toRefs } from 'vue';

const props = defineProps<{
  id: string,
  title?: string
}>();

const { id, title } = toRefs(props);
</script>

<template>
  <section :id="id">
    <span class="title">
      {{ (title ? title : id).toUpperCase() }}
    </span>
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
section {
  height: 100%;
}

.title {
  @extend .label;
  position: relative;
  padding: 0 2px 0 4px;
  top: 8px;
  left: 17px;
  background-color: transparent;
  color: #dddddd60;
}

:slotted(.view) {
  border: none;
  padding: 20px;
  background-color: #dddddd10;
  border-radius: 9px;
}
</style>