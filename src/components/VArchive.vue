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

const paths: Ref<{ id : string, name: string }[]> = ref([]);
const isRoot = computed(() => (paths.value[paths.value.length - 1]).id === ROOT_FOLDER_ID);
const pathDeep = computed(() => paths.value.length);
const basePath = { id: ROOT_FOLDER_ID, name: '' };

const searching: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

function load(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE) paths.value.push({ id: file.id, name: file.name });
  else emits('load', { ...file, fullPath: paths.value.map((v) => v.name).join('/')});
}

async function reload() {
  const currentPathId = (paths.value[pathDeep.value - 1]).id;
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

async function create(mimeType: MimeType) {
  loading.value = true;
  const parentId = (paths.value[pathDeep.value - 1]).id;
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
    return (file.mimeType === 'application/vnd.google-apps.folder') ? 'folder' : 'file';
  }
}

watch (isSelectMode, (v) => {
  if (!v)
    selectedFiles.value = [];
});

onMounted(() => {
  paths.value.push(basePath);
});
</script>

<template>
  <div class="wrapper" :class="{ grid : authStore.isAuthenticated }">
    <VWrapper id="archive">
      <div class="view" ref="archiveRef">
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
            :text="file.name"
            title
            @click="isSelectMode ? select(file) : load(file)"
          />
        </div>
      </div>
    </VWrapper>
    <VWrapper v-if="authStore.isAuthenticated" id="admin">
      <div class="view">
        <VItem icon="folder" @click="create(FOLDER_MIME_TYPE)" text="새 폴더" />
        <VItem icon="file" @click="create('text/markdown')" text="새 파일" />
        <!-- <VItem icon="pencil" @click="onSinglefile = !onSinglefile" text="단건 작업" /> -->
        <!-- <VItem icon="trash" text="다건 작업" /> -->
      </div>
    </VWrapper>
  </div>

</template>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  gap: 24px;

  &.grid {
    grid-template-columns: 1fr 140px;
  }

  #archive {
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
        
        :deep(.item) {
          flex-wrap: wrap;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }

          span {
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: calc(100% - 26px);
            overflow: hidden;
          }
        }
      }
    }
  }

  #admin {
    .view {
      height: 200px;
      @extend .base-view;

      :deep(.item) {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>