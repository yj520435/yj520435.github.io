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

const markdown = ref('');
const html = ref();
const articleRef = ref();

const isEditMode = ref(false);

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

watch(markdown, (v) => {
  html.value = converter.makeHtml(markdown.value);
})

watch(file, async (v?: File) => {
  if (v) {
    loading.value = true;
    markdown.value = await fetchContents(v.id);
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
        <div class="title">
          <span>{{ file.name }}</span>
          <div class="buttons">
            <!-- <button class="update" @click="isEditMode = !isEditMode">
              <img :src="require('@/assets/icons/pencil.svg')" alt="">
            </button> -->
            <button class="close" @click="emits('close')"/>
          </div>
        </div>
      </header>
      <section class="contents" :class="{ editing : isEditMode }">
        <textarea v-if="isEditMode" v-model="markdown"></textarea>
        <span></span>
        <article
          v-html="html"
          ref="articleRef"
        />
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#article {
  @extend .shadow;
  transform-origin: center;
  z-index: 10;

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
    display: grid;
    grid-template-rows: 40px 1fr;

    * {
      font-family: 'Noto Sans KR';
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: inherit;
      height: 40px;

      .title {
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

    .contents {
      height: calc(100vh - 40px);
      max-width: inherit;
      display: grid;

      &.editing {
        grid-template-rows: 1fr 21px 1fr;

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

        article {
          padding: 20px !important;
        }
      }
    }
  }
}
</style>