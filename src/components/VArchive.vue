<script setup lang="ts">
import VWrapper from './VWrapper.vue';
import { ROOT_FOLDER_ID, FOLDER_MIME_TYPE } from '@/constants';
import { sortAlphabetically } from '@/utils';
import { computed, onMounted, Ref, ref, watch, defineEmits } from 'vue';
import { File, MimeType } from '@/types';
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import { usePopupStore } from '@/stores/popupStore';
import VItem from './VItem.vue';

const emits = defineEmits(['load']);

const authStore = useAuthStore();
const popupStore = usePopupStore();

const account = computed(() => authStore.account);
const isAuthenticated = ref(true);

watch(account, (v) => {
  init(v);
  isAuthenticated.value = Object.values(v).every((x) => x !== undefined);
}, { deep: true });

const {
  init,
  createFile,
  fetchFiles,
  trashFiles,
} = useArchive();

const files: Ref<File[]> = ref([]);
const paths: Ref<string[]> = ref([]);
const isRoot = computed(() => paths.value[paths.value.length - 1] === ROOT_FOLDER_ID);
const pathDeep = computed(() => paths.value.length);

const searching: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

watch(pathDeep, async (v) => {
  searching.value = true;
  await reload();
  searching.value = false;
});

function load(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE) paths.value.push(file.id);
  else emits('load', file);
}

async function remove() {
  popupStore.show({
    type: 'confirm',
    icon: 'close',
    message: `${selectedFiles.value.length}개의 항목을 삭제할까요?`,
    callback: async () => {
      popupStore.hide();
      loading.value = true;
      const response = await trashFiles(selectedFiles.value.map((v) => v.id));
      await reload();
      loading.value = false;
      selectedFiles.value = [];
    }
  })
}

async function create(mimeType: MimeType) {
  popupStore.show({
    type: 'prompt',
    icon: 'pencil',
    callback: async (name: string) => {
      popupStore.hide();
      loading.value = true;
      const parentId = paths.value[pathDeep.value - 1];
      const response = await createFile(mimeType, name, [parentId]);
      // Error Handling...
      await reload();
      loading.value = false;
    }
  });
}

async function reload() {
  const currentPathId = paths.value[pathDeep.value - 1];
  files.value = [];
  const fetchedFiles = await fetchFiles(currentPathId);
  files.value = sort(fetchedFiles);
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

const isSelectMode = ref(false);
const selectedFiles: Ref<File[]> = ref([]);

function select(file: File) {
  const index = selectedFiles.value.findIndex((v) => v.id === file.id);
  if (index === -1)
    selectedFiles.value.push(file);
  else
    selectedFiles.value.splice(index, 1);
}

function icon(file: File): string {
  if (isSelectMode.value) {
    const isSelected = selectedFiles.value.findIndex((v) => v.id === file.id);
    return (isSelected !== -1) ? 'checkbox' : 'square';
  } else {
    switch (file.mimeType) {
      case 'text/x-markdown':
      return 'file';
    case 'application/vnd.google-apps.folder':
      return 'folder';
    default:
      return 'unknown';
    }
  }
}

onMounted(() => {
  paths.value.push(ROOT_FOLDER_ID);
})
</script>

<template>
  <VWrapper id="archive">
    <div class="view">
      <div v-if="searching" class="searching">
        <img :src="require(`@/assets/icons/search.svg`)" alt="">
      </div>
      <div v-else-if="loading" class="loading">
        <img :src="require(`@/assets/icons/load.svg`)" alt="">
      </div>
      <div v-else class="list">
        <VItem
          v-if="!isRoot"
          icon="home"
          text="."
          @click="paths = [ROOT_FOLDER_ID]"
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
          :text="file.name"
          @click="isSelectMode ? select(file) : load(file)"
        />
      </div>
    </div>
    <div v-if="isAuthenticated" class="options">
      <button class="new-folder" @click="create(FOLDER_MIME_TYPE)" />
      <button class="new-file" @click="create('text/x-markdown')" />
      <button class="select" @click="isSelectMode = !isSelectMode" />
      <button class="rename" />
      <button class="trash" />
    </div>
  </VWrapper>
</template>

<style lang="scss" scoped>
.view {
  height: 200px;

  .searching {
    @include screen-for-waiting(search);
  }

  .loading {
    @include screen-for-waiting(rotate);
  }

  .list {
    @include base-view;
    
    :deep(.item):hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

.options {
  @include flex-center;
  border: 1px solid $text-color;
  border-top: none;
  padding: 10px 15px;
  gap: 20px;

  button {
    border: none;

    &.new-folder {
      @include icon(folder);
    }

    &.new-file {
      @include icon(file);
    }

    &.select {
      @include icon(checkbox);
    }

    &.rename {
      @include icon(pencil);
    }

    &.trash {
      @include icon(unknown);
    }
  }
}
</style>