<script setup lang="ts">
import VWrapper from './VWrapper.vue';
import { ROOT_FOLDER_ID, FOLDER_MIME_TYPE } from '@/constants';
import { sortAlphabetically } from '@/utils';
import { computed, onMounted, Ref, ref, watch, defineEmits } from 'vue';
import { File, MimeType } from '@/types';
import { useArchive } from '@/composables/useArchive';
import { useAuthStore } from '@/stores/authStore';
import VItem from './VItem.vue';
import { usePopup } from '@/composables/usePopup';

const emits = defineEmits<{
  load: [file: File]
}>();

const authStore = useAuthStore();

const {
  createFile,
  fetchFile,
  trashFiles,
} = useArchive();

const files: Ref<File[]> = ref([]);
const paths: Ref<string[]> = ref([]);
const isRoot = computed(() => paths.value[paths.value.length - 1] === ROOT_FOLDER_ID);
const pathDeep = computed(() => paths.value.length);

const searching: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

function load(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE) paths.value.push(file.id);
  else emits('load', file);
}

async function reload() {
  const currentPathId = paths.value[pathDeep.value - 1];
  files.value = [];
  const fetchedFiles = await fetchFile(currentPathId);
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

watch(pathDeep, async () => {
  searching.value = true;
  await reload();
  searching.value = false;
});

const popup = usePopup('root');

const isTrashMode = ref(false);
const isSelectMode = ref(false);
const selectedFiles: Ref<File[]> = ref([]);

const archiveRef = ref();
const showContextMenu = ref(false);
const contextMenuStyle = ref({ top: '0', left: '0' });

function contextmenu(event: MouseEvent) {
  if (!authStore.isAuthenticated || !archiveRef.value) return;

  event.preventDefault();
  contextMenuStyle.value = {
    top: `${archiveRef.value.offsetTop + 86}px`,
    left: `${archiveRef.value.offsetWidth - 40}px`
  }
  showContextMenu.value = true;
}

async function create(mimeType: MimeType) {
  loading.value = true;
  const parentId = paths.value[pathDeep.value - 1];
  const reponse = await createFile(mimeType, [parentId]);
  /* Error Check */
  await reload();
  loading.value = false;
}

function select(file: File) {
  const index = selectedFiles.value.findIndex((v) => v.id === file.id);
  if (index === -1)
    selectedFiles.value.push(file);
  else
    selectedFiles.value.splice(index, 1);
}

function trash() {
  isTrashMode.value = !isTrashMode.value;
  
  popup.show({
    type: 'confirm',
    icon: 'trash',
    message: `정말 삭제할까요?`,
    submit: {
      type: 'warning',
      text: '삭제',
      callback: async () => {
        loading.value = true;
        const reponse = await trashFiles(selectedFiles.value.map((v) => v.id));
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

watch (isSelectMode, (v) => {
  if (!v)
    selectedFiles.value = [];
});

onMounted(() => {
  paths.value.push(ROOT_FOLDER_ID);

  // window.addEventListener('click', (e) => {
  //   showContextMenu.value = false;
  // })
});
</script>

<template>
  <VWrapper id="archive">
    <div class="view" @contextmenu="contextmenu" ref="archiveRef">
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
      <div
        v-show="showContextMenu"
        class="contextmenu"
        :style="contextMenuStyle"
      >
        <VItem icon="folder" @click="create(FOLDER_MIME_TYPE)" />
        <VItem icon="file" @click="create('text/x-markdown')" />
        <!-- <VItem :icon="isSelectMode ? '' : trash" @click="trash" /> -->
      </div>
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
    height: 100%;
    @extend .scroll;
    @extend .base-view;
    
    :deep(.item):hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .contextmenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 7px;
    z-index: 11;
    
    :deep(.item) {
      background-color: #00000090;
      padding: 6px;
      gap: 0;
      animation: contextmenu 0.5s forwards;
      opacity: 0;
      cursor: pointer;
      border-radius: 50%;

      &:first-child {
        animation-delay: 0.2s;
      }

      &:nth-child(2) {
        animation-delay: 0.1s;
      }

      &:hover {
        background-color: $text-color;

        img {
          filter: none;
        }
      }
    }
  }
}
</style>