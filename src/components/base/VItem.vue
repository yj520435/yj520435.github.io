<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  icon: string
  text?: string
  title?: boolean
}>();

const emits = defineEmits<{
  click: []
}>();

const title = computed(() => props.title ? props.text : undefined);
</script>

<template>
  <div class="item" @click="emits('click')">
    <img :src="require(`@/assets/icons/${props.icon}.svg`)" alt="">
    <span v-if="props.text" v-html="props.text" :title="title"></span>
    <span v-else class="text">
      <slot name="text"></slot>
    </span>
  </div>
  <slot name="subitem"></slot>
</template>
