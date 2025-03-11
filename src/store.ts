import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useItemStore = defineStore('item', () => {
  const folders: Ref<{ id: string; items: any }[]> = ref([]);

  function get(id: string) {
    return folders.value.find((v) => v.id === id);
  }

  function set(id: string, items: any) {
    folders.value.push({ id, items });
  }

  return { folders, get, set };
});
