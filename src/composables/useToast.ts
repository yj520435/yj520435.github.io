import VToast from '@/components/VToast.vue';
import { ToastOption } from '@/types';
import { h, render } from 'vue';

export function useToast(id: string) {
  function show(option: ToastOption) {
    const root = document.getElementById(id);
    if (!root) return;

    const toast = h(VToast, { option, onClose: hide });
    render(toast, root);
  }

  function hide() {
    const root = document.getElementById(id);
    if (!root) return;

    render(null, root);
  }

  return {
    show,
  };
}
