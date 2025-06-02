import VPopup from '@/components/VPopup.vue';
import { PopupOption } from '@/types';
import { h, render } from 'vue';

export function usePopup(id: string) {
  async function show(option: PopupOption, slots?: any) {
    const root = document.getElementById(id);
    if (!root) return;

    const popup = h(
      VPopup,
      {
        option,
        onClose: hide,
      },
      () => slots
    );

    render(popup, root);
  }

  function hide() {
    const root = document.getElementById(id);
    if (!root) return;

    render(null, root);
  }

  return {
    show,
    hide,
  };
}
