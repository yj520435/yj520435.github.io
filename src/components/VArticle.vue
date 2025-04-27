<script setup lang="ts">
import { File, PopupOption, ToastOption } from '@/types';
import hljs from 'highlight.js';
import { Converter } from 'showdown';
import { ref, defineProps, defineEmits, watch, computed, Ref, h, VNode } from 'vue';
import 'highlight.js/styles/github.css'
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError, AxiosResponse } from 'axios';
import VItem from './VItem.vue';
import { getFormattedDate } from '@/utils';
import { usePopup } from '@/composables/usePopup';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  file?: File
}>();

const emits = defineEmits<{
  close: [],
  load: [file: File]
}>();

const authStore = useAuthStore();

const {
  fetchContents,
  updateContents,
  trashFiles,
  updateFile,
} = useArchive();

const converter = new Converter({
  tables: true,
  simpleLineBreaks: true,
});

const file = computed(() => props.file);
const fileCopy: Ref<File> = ref({} as File);

const title = ref('');
const markdown = ref('');
const html = computed(() => converter.makeHtml(title.value + markdown.value));

const loading = ref(false);
const updating = ref(false);
const isEditMode = ref(false);

const editorRef = ref();
const viewerRef = ref();

function highlightCode() {
  hljs.highlightAll();
}

function addMouseEvent() {
  const elements = viewerRef.value.querySelectorAll('pre code');
  
  for (const el of elements) {
    let trigger = false;
    let pos = { x: 0, left: 0 };

    el.onmousedown = (event: MouseEvent) => {
      pos = { x: event.clientX, left: el.scrollLeft };
      trigger = true;
      el.style.cursor = 'grabbing';
    };

    el.onmousemove = (event: MouseEvent) => {
      if (trigger) {
        const dx = event.clientX - pos.x;
        el.scrollLeft = pos.left - dx;
      }
    };

    el.onmouseup = () => {
      pos.left = el.scrollLeft;
      trigger = false;
      el.style.cursor = 'grab';
    };
  }
}

function scrollToEnd(element?: HTMLElement) {
  if (!element) return;

  const scrollHeight = element.scrollHeight;
  element.scrollTo({ top: scrollHeight, behavior: 'smooth' });
}

watch(file, async (v?: File, v0?: File) => {
  if (v) {
    fileCopy.value = { ...v };

    if (!v0 || v.id !== v0.id) {
      loading.value = true;
      markdown.value = await fetchContents(v.id);
      loading.value = false;

      setTimeout(highlightCode, 500);
      setTimeout(addMouseEvent, 1000);
    }

    title.value = `<header><h1>${v.name}</h1></header>`
  }
}, { deep: true });

watch(markdown, () => {
  if (isEditMode.value)
    scrollToEnd(viewerRef.value as HTMLElement);
}, { deep: true });

watch(isEditMode, (v) => {
  if (v) {
    setTimeout(() => {
      scrollToEnd(viewerRef.value);
      scrollToEnd(editorRef.value);
    }, 300);
  }
})

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

  const fileNameInput = h('input', {
    type: 'text',
    value: file.value.name,
    placeholder: '파일명',
    disabled: !authStore.isAuthenticated
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
      id: 'title',
      name: '제목',
      value: fileNameInput
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

  const popupOption: PopupOption = authStore.isAuthenticated ? {
    type: 'confirm',
    icon: 'info',
    submit: {
      type: 'default',
      text: '확인',
      callback: async () => await rename(fileNameInput)
    }
  } : {
    type: 'alert',
    icon: 'info'
  }

  popup.show(popupOption, slot);
}

async function rename(component: VNode) {
  if (!file.value || !component.el) return;
  const name = component.el.value;
  
  popup.hide();
  updating.value = true;

  const response: AxiosResponse | undefined = await updateFile(file.value.id, { name });
  if (response && response.status === 200)
    emits('load', response.data);

  updating.value = false;
}

async function save(event: KeyboardEvent) {
  event.preventDefault();

  if (!file.value) return;
  
  updating.value = true;
  const response = await updateContents(file.value.id, markdown.value);

  if (!response) return;

  const toastOption: ToastOption = (response.status === 200) ? {
    icon: 'check',
    text: '저장완료',
    class: 'success'
  } : {
    icon: 'close',
    text: (response as AxiosError).message,
    class: 'fail'
  }
  toast.show(toastOption);
  
  updating.value = false;
}

function edit() {
  isEditMode.value = !isEditMode.value;
}

function close() {
  emits('close');
  isEditMode.value = false;
  title.value = '';
  markdown.value = '';
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
    <div
      v-if="html"
      class="article"
    >
      <header>
        <div class="buttons">
          <VItem
            v-if="authStore.isAuthenticated"
            icon="trash"
            @click="trash"
          />
          <VItem
            v-if="authStore.isAuthenticated"
            :icon="isEditMode ? 'book' : 'pencil'"
            @click="edit"
          />
          <VItem icon="info" @click="info" />
          <VItem icon="close" @click="close" />
        </div>
      </header>
      <section class="contents" :class="{ editing : isEditMode }">
        <article
          id="viewer"
          v-html="html"
          ref="viewerRef"
        />
        <span v-if="isEditMode" />
        <textarea
          v-if="isEditMode"
          v-model="markdown"
          @keydown.ctrl.s="save"
          ref="editorRef"
        ></textarea>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#article {
  @extend .shadow;

  transform-origin: center;
  z-index: 10;

  .loading,
  .updating {
    position: absolute;
    background-color: #00000070;
    z-index: 12;
    width: 100%;
    // transform-origin: top;

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
    margin: 0;
    border: $base-border;
    background-color: #ffffff;
    width: 100%;
    max-width: 603px;
    display: grid;
    grid-template-rows: 40px 1fr;

    * {
      font-family: 'Noto Sans KR';
      outline: none;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: right;
      width: 100%;
      max-width: inherit;
      height: 40px;
      background-color: white;
      z-index: 11;
      padding: 10px 20px;

      .buttons {
        display: flex;
        gap: 20px;

        :deep(.item) {
          gap: 0;
          cursor: pointer;

          &:hover {
            transform: scale(1.3);
          }

          img {
            filter: none;
          }
        }
      }
    }

    .contents {
      height: calc(100vh - 40px);
      max-width: inherit;
      display: grid;

      &.editing {
        grid-template-rows: 2fr 21px 1fr;

        span {
          display: block;
          margin: 10px;
          height: 1px;
          background-color: $text-color;
        }

        textarea {
          @extend .scroll;
          padding: 20px;
          resize: none;
          font-size: 16px;
          color: $base-color;
          outline: none;
          border: none;
          line-height: 1.8;
        }
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