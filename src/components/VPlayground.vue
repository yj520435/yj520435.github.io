<script setup lang="ts">
import { ref, watch, Ref,onMounted } from 'vue';
import 'highlight.js/styles/atom-one-dark.css';
import VItem from './VItem.vue';
import { useArticle } from '@/composables/useArticle';

const handler = useArticle();

const htmlRef = ref();
const markdownRef = ref();

const markdown = ref('');

onMounted(async () => {
  const result = await fetch('sample.md');
  markdown.value = await result.text();
  handler.convertToHtml(markdown.value);
});

watch(htmlRef, v => {
  if (v) {
    handler.init(v);
  }
})

const mode: Ref<'HTML' | 'MARKDOWN'> = ref('HTML');
</script>

<template>
  <main id="article">
    <div class="article">
      <header>
        <div class="buttons">
          <VItem icon="trash" />
          <VItem icon="repeat" />
          <VItem icon="info" />
          <VItem icon="close" />
        </div>
      </header>
      <section class="contents">
        <textarea
          v-show="mode === 'MARKDOWN'"
          v-model="markdown"
          ref="markdownRef"          
        ></textarea>
        <article
          v-show="mode === 'HTML'"
          contenteditable
          @input="handler.input(undefined, true)"
          @keyup.enter.exact="handler.enter"
          @keydown.tab="handler.tab"
          @keydown.ctrl.v="handler.paste"
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