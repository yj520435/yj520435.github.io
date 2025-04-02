<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  icon: string
  text?: string
  click?: Function
}>();
const emits = defineEmits(['click']);
</script>

<template>
  <div class="item" @click="emits('click')">
    <img :src="require(`@/assets/icons/${props.icon}.svg`)" alt="">
    <span v-if="props.text" v-html="props.text"></span>
    <span v-else class="text">
      <slot name="text"></slot>
    </span>
  </div>
  <slot name="subitem"></slot>
</template>

<style lang="scss" scoped>
.item {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    filter: $image-filter;
  }
}
</style>