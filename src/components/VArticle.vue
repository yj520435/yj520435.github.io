<script setup lang="ts">
import { File } from '@/types';
import hljs from 'highlight.js';
import { Converter } from 'showdown';
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import 'highlight.js/styles/github.css'
import { useZoomStore } from '@/stores/zoomStore';
import { useArchive } from '@/composables/useArchive';

const props = defineProps<{
  file?: File
}>();
const emits = defineEmits(['close']);

const zoom = useZoomStore();

const {
  fetchContents
} = useArchive();

const converter = new Converter({
  tables: true,
  simpleLineBreaks: true,
});

const file = computed(() => props.file);
const loading = ref(true);
const contents = ref();
const articleRef = ref();

function highlightCode() {
  hljs.highlightAll();
}

function addMouseEvent() {
  const elements = articleRef.value.querySelectorAll('pre code');
  
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

watch(file, async (v?: File) => {
  if (v) {
    loading.value = true;
    const markdown = await fetchContents(v.id);
    contents.value = converter.makeHtml(markdown);
    loading.value = false;

    setTimeout(highlightCode, 500);
    setTimeout(addMouseEvent, 1000);
  }
});
</script>

<template>
  <main id="article" v-if="file" :style="zoom.style">
    <div v-if="loading" class="loading">
      <img :src="require('@/assets/icons/search.svg')" alt="loading">
    </div>
    <div
      v-else
      class="article"
      :style="{ height: `${(1 / zoom.scale) * 100}%` }"
    >
      <header>
        <div>
          <span>{{ file.name }}</span>
          <button class="close" @click="emits('close')"/>
        </div>
      </header>
      <article
        v-html="contents"
        ref="articleRef"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
#article {
  @extend .shadow;
  transform-origin: center;

  .loading {
    @include screen-for-waiting(search);
    // transform-origin: top;

    img {
      width: 36px;
      height: 36px;
    }
  }

  .article {
    margin: 0;
    border: $base-border;
    background-color: #ffffff;
    width: 100%;
    max-width: 603px;

    * {
      font-family: 'Noto Sans KR';
    }

    header {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 6px;
      max-width: inherit;
      height: 40px;
      z-index: 10;

      div {
        display: grid;
        grid-template-columns: 1fr auto;
        background-color: #ffffff;
        width: 100%;
        padding: 10px 20px;

        span {
          font-weight: 600;
          color: #aaaaaa;
        }

        button {
          @extend .bg-image-center;
          border: none;
          background-size: contain;
          margin: 2px;

          &.close {
            @include icon(close);
            filter: none;
          }

          &:hover {
            transform: scale(1.3);
          }
        }
      }
    }
  }
}
</style>