<script setup lang="ts">
import { File, PopupOption, ToastOption } from '@/types';
import hljs from 'highlight.js';
import { ref, defineProps, defineEmits, watch, computed, Ref, h, VNode } from 'vue';
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';
import { getFormattedDate } from '@/utils';
import { usePopup } from '@/composables/usePopup';
import { useToast } from '@/composables/useToast';
import ArticleWizard from '@/utils/article-wizard';

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
  
const wizard = new ArticleWizard();

const htmlRef = ref();
const markdownRef = ref();

const title = computed(() => `<header><h1>${file.value?.name.substring(3) }</h1></header>`);
const markdown = ref('');
const markdownCopy = ref('');
const opacity = ref(0);

function addElementEvent() {
  // Mouse Event on Codeblock
  const codeblocks = htmlRef.value.querySelectorAll('pre');

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
  if (authStore.isAuthenticated) {
    const links = htmlRef.value.querySelectorAll('a');

    for (const link of links) {
      const href = link.href;
      if (!href) return;
      link.onclick = () => open(href, '_blank');
    }
  }
  
  // Code Highlight
  const codes = htmlRef.value.querySelectorAll('pre code');
  for (const code of codes) {
    hljs.highlightElement(code);
  }
}

function scrollToEnd(element?: HTMLElement) {
  if (!element) return;

  const scrollHeight = element.scrollHeight;
  element.scrollTo({ top: scrollHeight, behavior: 'smooth' });
}

watch(file, async (v?: File) => {
  if (v) {
    fileCopy.value = { ...v };

    loading.value = true;
    markdown.value = await fetchContents(v.id);
    markdownCopy.value = markdown.value;
    (htmlRef.value as HTMLElement).innerHTML = title.value;
    wizard.convertMarkdownToHtml(markdownCopy.value, htmlRef.value);
    loading.value = false;
    opacity.value = 1;
    emits('load');

    setTimeout(addElementEvent, 500);
  }
}, { deep: true });

watch(htmlRef, v => {
  if (v)
    wizard.init(v);
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

  if (!file.value || !htmlRef.value) return;
  
  updating.value = true;
  const markdown = mode.value === 'HTML'
    ? wizard.convertHtmlToMarkdown(htmlRef.value)
    : markdownCopy.value;
  const response = await updateContents(file.value.id, markdown);

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

const mode: Ref<'HTML' | 'MARKDOWN'> = ref('HTML');

async function changeMode() {
  mode.value = (mode.value === 'HTML') ? 'MARKDOWN' : 'HTML';

  if (mode.value === 'HTML') {
    (htmlRef.value as HTMLElement).innerHTML = title.value;
    wizard.convertMarkdownToHtml(markdownCopy.value, htmlRef.value);
  }

  if (mode.value === 'MARKDOWN')
    markdownCopy.value = wizard.convertHtmlToMarkdown(htmlRef.value)
}

function close() {
  emits('close');
  markdown.value = '';
  opacity.value = 0;
  mode.value = 'HTML';
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
            class="trash"
            @click="trash"
          />
          <button
            v-if="authStore.isAuthenticated"
            class="mode"
            @click="changeMode"
          />
          <button class="info" @click="info" />
          <button class="close" @click="close" />
        </div>
      </header>
      <section class="contents">
        <textarea
          v-show="mode === 'MARKDOWN'"
          v-model="markdownCopy"
          @keydown.ctrl.s="save"
          ref="markdownRef"          
        ></textarea>
        <article
          v-show="mode === 'HTML'"
          :contenteditable="authStore.isAuthenticated"
          @input="wizard.input(undefined)"
          @keyup.enter.exact="wizard.enter"
          @keydown.tab="wizard.tab"
          @keydown.ctrl.s="save"
          ref="htmlRef"
        >
          <p></p>
        </article>
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

      textarea {
        @extend .scroll;

        padding: 0 20px 40px 20px;
        color: $base-color;

        width: 100%;
        height: 100%;
        font-family: 'Noto Sans KR';
        font-size: 16px;
        line-height: 1.8;
        border: none;
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