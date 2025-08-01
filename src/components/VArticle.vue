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
