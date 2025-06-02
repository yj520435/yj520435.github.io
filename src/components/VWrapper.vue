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
.title {
  @extend .label;
  position: relative;
  padding: 0 2px 0 4px;
  top: 8px;
  left: 17px;
}

:slotted(.view) {
  border: 1px solid $text-color;
  padding: 15px;
}
</style>