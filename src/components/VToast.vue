<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import VItem from './VItem.vue';
import { ToastOption } from '@/types';

const props = defineProps<{
  option: ToastOption
}>();
const emits = defineEmits(['close']);

const option = computed(() => props.option);

onMounted(() => {
  setTimeout(() => {
    emits('close');
  }, 4000);
});
</script>

<template>
  <div class="snackbar" :class="option.class">
    <VItem :icon="option.icon" :text="option.text" />
  </div>
</template>

<style lang="scss" scoped>
.snackbar {
  position: absolute;
  left: 50%;
  color: white;
  padding: 10px;
  transform: translateX(-50%);
  z-index: 20;
  border-radius: 6px;
  animation: slide 4s forwards;

  &.success {
    background-color: green;
  }

  &.fail {
    background-color: firebrick;
  }

  :deep(.item) {
    img {
      filter: invert(100%) sepia(8%) saturate(31%) hue-rotate(300deg) brightness(106%) contrast(110%);
    }
  }
}
</style>