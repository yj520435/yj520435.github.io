<script setup lang="ts">
import VWrapper from './base/VWrapper.vue';
import { ROOT_FOLDER_ID, FOLDER_MIME_TYPE } from '@/constants';
import { sortAlphabetically } from '@/utils';
import { computed, onMounted, Ref, ref, watch, defineEmits, h } from 'vue';
import { File, MimeType } from '@/types';
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import VItem from './base/VItem.vue';
import { usePopup } from '@/composables/usePopup';

const emits = defineEmits<{
  load: [file: File]
}>();

const authStore = useAuthStore();

const {
  createFile,
  fetchFile,
  updateFile,
  trashFiles,
} = useArchive();

const files: Ref<File[]> = ref([]);

const paths: Ref<{ id : string, name: string }[]> = ref([]);
const isRoot = computed(() => (paths.value[paths.value.length - 1]).id === ROOT_FOLDER_ID);
const pathDeep = computed(() => paths.value.length);
const basePath = { id: ROOT_FOLDER_ID, name: '' };

const searching: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

function isFolder(mimeType: MimeType) {
  return mimeType === 'application/vnd.google-apps.folder';
}

function load(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE) paths.value.push({ id: file.id, name: file.name });
  else emits('load', { ...file, fullPath: paths.value.map((v) => v.name).join('/')});
}

async function reload() {
  const currentPathId = (paths.value[pathDeep.value - 1]).id;
  files.value = [];
  const fetchedFiles = await fetchFile(currentPathId);
  if (typeof fetchedFiles === 'undefined') {
    // Do something
  } else {
    files.value = sort(fetchedFiles);
  }
}

function sort(data: File[]): File[] {
  const filteredFolders = data.filter((v: File) => v.mimeType === FOLDER_MIME_TYPE);
  const sortedFolders = [...filteredFolders].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  const filteredFiles = data
    .filter((v: File) => v.mimeType !== FOLDER_MIME_TYPE)
    .map((v: File) => {
      const copied = { ...v };
      const index = v.name.lastIndexOf('.');
      const name = index !== -1 ? v.name.substring(0, index) : v.name;
      copied.name = name;
      return copied;
    });
  const sortedFiles = [...filteredFiles].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  return sortedFolders.concat(sortedFiles);
}

watch(pathDeep, async () => {
  searching.value = true;
  await reload();
  searching.value = false;
});

const popup = usePopup('root');

const isSelectMode = ref(false);
const selectedFiles: Ref<File[]> = ref([]);

const archiveRef = ref();

async function create() {
  const addRadioButton = (name: string, value: string, checked?: boolean) => {
    return [
      h('input', { type: 'radio', id: value, name, value, checked }),
      h('label', { for: value }, h('img', { src: require(`@/assets/icons/${value}.svg`) }))
    ]
  }

  const slot = h('form', { class: 'create', onSubmit: (event) =>
    event.preventDefault()}, [
    h('div', [
      ...addRadioButton('type', 'folder'),
      ...addRadioButton('type', 'file', true)
    ]),
    h('input', { type: 'text', name: 'name', placeholder: 'New File Name', value: '', autofocus: true })
  ]);

  const callback = async () => {
    loading.value = true;
    if (slot.el instanceof HTMLFormElement) {
      const fileInfo: string[] = [];

      const formData = new FormData(slot.el);
      for (const data of formData.entries()) {
        fileInfo.push(data[1] as string);
      }

      const mimeType = fileInfo[0] === 'folder'
        ? 'application/vnd.google-apps.folder'
        : 'text/markdown';
      const fileName = fileInfo[1] ?? 'New File';
      const parentId = (paths.value[pathDeep.value - 1]).id;      
      
      await createFile(mimeType, [parentId], fileName);
      await reload();
    }
    loading.value = false;
  }

  popup.show({
    type: 'confirm',
    icon: 'plus',
    submit: {
      type: 'default',
      text: '확인',
      callback
    }
  }, slot);
}

function rename() {
  if (selectedFiles.value.length < 1) return;
  const file = selectedFiles.value[0];

  const slot = h('input', { class: 'rename', type: 'text', value: file.name });

  const callback = async () => {
    const name = slot?.el?.value;

    popup.hide();
    loading.value = true;
    const response = await updateFile(file.id, { name });
    console.log(response);
    reload();
    loading.value = false;
  }

  popup.show({
    type: 'confirm',
    icon: 'pencil',
    submit: {
      type: 'default',
      text: '확인',
      callback
    }
  }, slot);
}

function trash() {
  popup.show({
    type: 'confirm',
    icon: 'trash',
    message: '정말 삭제할까요?',
    submit: {
      type: 'warning',
      text: '삭제',
      callback: async () => {
        loading.value = true;
        await trashFiles(selectedFiles.value.map((v) => v.id));
        await reload();
        loading.value = false;
        selectedFiles.value = [];
      }
    }
  })
}

function icon(file: File): string {
  if (isSelectMode.value) {
    const isSelected = selectedFiles.value.findIndex((v) => v.id === file.id);
    return (isSelected !== -1) ? 'checkbox' : 'square';
  } else {
    return (file.mimeType === 'application/vnd.google-apps.folder') ? 'folder' : 'file';
  }
}

onMounted(() => {
  paths.value.push(basePath);
});
</script>

<template>
  <VWrapper id="archive">
    <div class="view" ref="archiveRef">
      <div v-if="searching" class="searching">
        <img :src="require('@/assets/icons/search.svg')" alt="">
      </div>
      <div v-else-if="loading" class="loading">
        <img :src="require('@/assets/icons/load.svg')" alt="">
      </div>
      <div v-else class="list">
        <VItem
          v-if="!isRoot"
          icon="home"
          text="."
          @click="paths = [basePath]"
        />
        <VItem
          v-if="!isRoot"
          icon="folder"
          text=".."
          @click="paths.pop()"
        />
        <VItem
          v-for="file of files"
          :key="file.id"
          :icon="icon(file)"
          :text="isFolder(file.mimeType) ? file.name : file.name.substring(3)"
          title
          @click="load(file)"
        />
        <VItem
          v-if="authStore.isAuthenticated"
          icon="magic-wand"
          text="New File"
          @click="create"
        />
        <!-- <VItem
          icon="trash"
          text="Delete File"
          @click="trash"
        /> -->
      </div>
    </div>
  </VWrapper>
</template>
