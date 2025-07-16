<script setup lang="ts">
import { File, PopupOption, ToastOption } from '@/types';
import hljs from 'highlight.js';
import { ref, defineProps, defineEmits, watch, computed, Ref, h } from 'vue';
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';
import { getFormattedDate } from '@/utils';
import { usePopup } from '@/composables/usePopup';
import { useToast } from '@/composables/useToast';
import { VueShowdown } from 'vue-showdown';

const props = defineProps<{
  file?: File
}>();

const emits = defineEmits<{
  close: [],
  load: []
}>();

const authStore = useAuthStore();

const {
  fetchContents,
  updateContents,
  trashFiles,
  updateFile,
} = useArchive();


const file = computed(() => props.file);
const fileCopy: Ref<File> = ref({} as File);

const loading = ref(false);
const updating = ref(false);

const title = ref('');
const markdown = ref('');
const markdownCopy = ref('');
const opacity = ref(0);

const header = ref('');

function addElementEvent() {
  // Mouse Event on Codeblock
  const codeblocks = document.querySelectorAll('pre');

  for (const codeblock of codeblocks) {
    let trigger = false;
    let pos = { x: 0, left: 0 };

    codeblock.onmousedown = (event: MouseEvent) => {
      pos = { x: event.clientX, left: codeblock.scrollLeft };
      trigger = true;
    };
    codeblock.onmousemove = (event: MouseEvent) => {
      if (trigger) {
        const dx = event.clientX - pos.x;
        codeblock.scrollLeft = pos.left - dx;
      }
    };
    codeblock.onmouseup = () => {
      pos.left = codeblock.scrollLeft;
      trigger = false;
    };
    codeblock.onmouseleave = () => {
      trigger = false;
    }
  }

  // Click Event on Link
  // if (authStore.isAuthenticated) {
  //   const links = htmlRef.value.querySelectorAll('a');

  //   for (const link of links) {
  //     const href = link.href;
  //     if (!href) return;
  //     link.onclick = () => open(href, '_blank');
  //   }
  // }
  
  // Code Highlight
  const codes = document.querySelectorAll('pre code');
  for (const code of codes) {
    hljs.highlightElement(code as HTMLElement);
  }
}

watch(file, async (v?: File) => {
  if (v) {
    fileCopy.value = { ...v };

    loading.value = true;
    markdown.value = await fetchContents(v.id);
    markdownCopy.value = markdown.value;
    header.value = `<header><h1>${v.name}</h1></header>`;
    loading.value = false;
    opacity.value = 1;
    emits('load');

    setTimeout(addElementEvent, 500);
  }
}, { deep: true });

const popup = usePopup('article');
const toast = useToast('article');

function trash() {
  popup.show({
    type: 'confirm',
    icon: 'trash',
    message: '삭제할까요?',
    submit: {
      type: 'warning',
      text: '삭제',
      callback: async () => {
        if (!file.value) return;
        await trashFiles([file.value.id]);
      }
    }
  })
}

function info() {
  if (!file.value) return;

  const fullPath = h('input', {
    type: 'text',
    value: file.value.fullPath ?? '/',
    disabled: true
  });

  // const sharedIcon = (value: boolean) => file.value!.shared === value ? 'checkbox' : 'square';
  // const sharedButton = h('div', { class: 'shared' }, [
  //   h(VItem, { icon: sharedIcon(true), text: '공개' }),
  //   h(VItem, { icon: sharedIcon(false), text: '비공개' }),
  // ]);

  const createdDate = h('span', getFormattedDate(file.value.createdTime));
  const modifiedDate = h('span', getFormattedDate(file.value.modifiedTime));

  const infos = [
    {
      id: 'path',
      name: '경로',
      value: fullPath
    },
    {
      id: 'created',
      name: '생성일',
      value: createdDate
    },
    {
      id: 'modified',
      name: '수정일',
      value: modifiedDate
    },
  ]

  const slot = h('ul', { id: 'file-info' }, Array.from(infos).map(
    (v) => h('li', [h('span', v.name), v.value])
  ));

  const popupOption: PopupOption = {
    type: 'alert',
    icon: 'info'
  };

  popup.show(popupOption, slot);
}

async function save(event: KeyboardEvent) {
  event.preventDefault();

  if (!file.value) return;
  
  updating.value = true;
  const response = await updateContents(file.value.id, markdownCopy.value);

  if (!response) return;

  const toastOption: ToastOption = (response.status === 200) ? {
    icon: 'check',
    text: 'Saved',
    class: 'success'
  } : {
    icon: 'close',
    text: (response as AxiosError).message,
    class: 'fail'
  }
  toast.show(toastOption);
  
  updating.value = false;
}

function close() {
  emits('close');
  title.value = '';
  markdown.value = '';
  opacity.value = 0;
}

function addFigure() {
  const slot = h('ul', { id: 'figure-info' }, [
    h('li', [ h('span', '이름'), h('input', { type: 'text', id: 'alt' }) ]),
    h('li', [ h('span', '주소'), h('input', { type: 'text', id: 'src' }) ]),
    h('li', [ h('span', '설명'), h('input', { type: 'text', id: 'caption' }) ]),
  ]);

  popup.show({
    type: 'confirm',
    icon: 'image'
  }, slot);
}
</script>

<template>
  <main id="article" v-if="file">
    <div v-if="loading" class="loading">
      <img :src="require('@/assets/icons/search.svg')" alt="loading">
    </div>
    <div v-if="updating" class="updating">
      <img :src="require('@/assets/icons/load.svg')" alt="updating">
    </div>
    <div class="article" :style="{ opacity }">
      <header>
        <div class="buttons">
          <button
            v-if="authStore.isAuthenticated"
            class="figure"
            @click="addFigure"
          >

          </button>
          <button
            v-if="authStore.isAuthenticated"
            class="trash"
            @click="trash"
          />
          <button
            v-if="authStore.isAuthenticated"
            class="mode"
          />
          <button class="info" @click="info" />
          <button class="close" @click="close" />
        </div>
      </header>
      <section class="contents">
        <VueShowdown
          :markdown="header + markdownCopy"
          flavor="github"
          class="showdown"
        />
        <textarea
          v-if="authStore.isAuthenticated"
          v-model="markdownCopy"
          @keydown.ctrl.s="save"
        ></textarea>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#article {
  @extend .shadow;
  background-color: #00000070;

  transform-origin: center;
  z-index: 10;

  .loading,
  .updating {
    position: absolute;
    background-color: #00000070;
    z-index: 12;
    width: 100%;

    img {
      width: 36px !important;
      height: 36px !important;
    }
  }

  .loading {
    @include screen-for-waiting(search);
  }

  .updating {
    @include screen-for-waiting(rotate);
  }

  .article {
    width: 100%;
    margin: 0;
    border: $base-border;
    background-color: #ffffff;
    display: grid;
    grid-template-rows: 40px 1fr;
    transition: 600ms;
    max-width: 900px;

    * {
      font-family: 'Noto Sans KR';
      outline: none;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: right;
      width: 100%;
      height: 40px;
      background-color: white;
      z-index: 11;
      padding: 10px 20px;

      .buttons {
        display: flex;
        gap: 20px;

        button {
          @extend .bg-image-center;
          filter: none !important;
          background-size: 18px !important;

          &:hover {
            transform: scale(1.3);
          }

          &.highlight {
            @include icon(magic-wand);
          }

          &.figure {
            @include icon(image);
          }

          &.trash {
            @include icon(trash);
          }

          &.mode {
            @include icon(switch);
            background-size: 16px !important;
          }

          &.info {
            @include icon(info);
          }

          &.close {
            @include icon(close);
          }
        }
      }

      .bubble {
        position: absolute;
        background-color: #f7f7f7;
        color: $base-color;
        top: 36px;
        transform: translateX(-152px);
        width: 200px;
        padding: 5px 10px;
        border-radius: 11px;
        border: 1px solid #aaaaaa70;
        border-top-right-radius: 0;

        span {
          display: inline-block;
        }
      }
    }

    .contents {
      height: calc(100vh - 40px);
      display: grid;
      grid-template-rows: 2fr 1fr;

      textarea {
        @extend .scroll;

        padding: 20px;
        color: $base-color;

        font-family: 'Noto Sans KR';
        font-size: 16px;
        line-height: 1.8;
        border: none;
        border-top: 2px solid $text-color;
      }
    }
  }
}

:deep(#popup) {
  #file-info {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: inline-grid;
      grid-template-columns: 60px auto;
      width: 100%;
      border-bottom: 1px solid #aaaaaa90;
      padding: 6px 2px;

      input[type='text'] {
        width: inherit;
        background-color: transparent;
        outline: none;
        border: none;
        color: $text-color;
        padding: 0;
      }

      .checkbox {
        width: inehrit;
        display: inline-grid;
        grid-template-columns: 1fr 1fr;

        label {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          input[type='checkbox'] {
            display: none;
          }

          span {
            @include icon(checkbox);
            display: block;
          }
        }
      }
    }
  }

  input {
    background-color: transparent;
    outline: none;
    border: none;
    border-bottom: $base-border;
    color: $text-color;
    padding: 3px;
  }
}
</style>