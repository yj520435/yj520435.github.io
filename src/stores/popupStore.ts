import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

interface Options {
  type: 'confirm' | 'prompt' | 'alert';
  icon: string;
  props?: any;
  message?: string;
  callback?: Function;
}

const defaultOptions = {
  type: 'confirm',
  icon: 'question',
} as Options;

export const usePopupStore = defineStore('popup', () => {
  const isShow: Ref<boolean> = ref(false);
  const options: Ref<Options> = ref(defaultOptions);

  function show(params: Options) {
    options.value = params;
    isShow.value = true;
  }

  function hide() {
    isShow.value = false;
    options.value = defaultOptions;
  }

  return {
    isShow,
    options,
    show,
    hide,
  };
});
