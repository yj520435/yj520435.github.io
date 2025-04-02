<script setup lang="ts">
import { usePopupStore } from '@/stores/popupStore';
import { ref, computed } from 'vue';

const popupStore = usePopupStore();
const options = computed(() => popupStore.options);

const model = ref();

function submit() {
  const callback = options.value.callback;
  if (!callback)
    return;
  
  callback(model.value);
  model.value = undefined;
}
</script>

<template>
  <main v-if="popupStore.isShow" id="popup">
    <div class="outer">
      <div class="inner">
        <img :src="require(`@/assets/icons/${options.icon}.svg`)" alt="" />
        <div class="message">
          <span v-if="options.type !== 'prompt'">{{ options.message }}</span>
          <input v-else v-model="model" placeholder="Untitled" autofocus />
        </div>
        <div class="buttons">
          <button @click="popupStore.hide" class="cancel">취소</button>
          <button @click="submit" class="submit">확인</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#popup {
  @include shadow;

  * {
    font-family: 'Galmuri9';
    font-size: 14px;
  }

  .outer {
    width: 300px;
    height: 240px;
    background-color: $base-color;

    .inner {
      @include flex-center;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border: 1px solid $text-color;
      margin: 5px;
      flex-direction: column;
      gap: 30px;
      padding: 20px;

      img {
        width: 30px;
        height: 30px;
        filter: $image-filter;
        opacity: 0.7;
      }

      .message {
        margin-bottom: 20px;

        input {
          background-color: transparent;
          outline: none;
          border: none;
          border-bottom: $base-border;
          color: $text-color;
          padding: 2px 0;
        }
      }

      .buttons {
        display: flex;
        gap: 30px;

        button {
          padding: 5px 20px;
          color: $text-color;
          border: none;
          border: $base-border;
          background-color: #dddddd30;

          &.submit {
            background-color: #32cd3260;
          }
        }
      }
    }
  }
}
</style>