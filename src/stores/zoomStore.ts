import { defineStore } from 'pinia';
import { computed, onUnmounted, Ref, ref, watch } from 'vue';

export const useZoomStore = defineStore('zoom', () => {
  const isActive: Ref<boolean> = ref(false);

  const scale: Ref<number> = ref(1);
  const style = computed(() => `transform: scale(${scale.value})`);

  function toggle(): void {
    isActive.value = !isActive.value;
  }

  function resize(event?: any): void {
    const width = event ? event.target.innerWidth : window.innerWidth;
    scale.value = 1 + (width - 500) * (0.3 / 1420);
  }

  function addResizeEvent() {
    resize();
    window.addEventListener('resize', resize);
  }

  function removeResizeEvent() {
    scale.value = 1;
    window.removeEventListener('resize', resize);
  }

  watch(isActive, (v) => (v ? addResizeEvent() : removeResizeEvent()));

  onUnmounted(() => removeResizeEvent());

  return { isActive, scale, style, toggle };
});
