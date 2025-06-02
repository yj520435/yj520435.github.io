<script setup lang="ts">
import { PopupOption } from '@/types';
import { defineEmits, computed, defineProps } from 'vue';

const props = defineProps<{
  option: PopupOption
}>();

const emits = defineEmits<{
  close: []
}>();

const option = computed(() => props.option);
</script>

<template>
  <main id="popup">
    <div class="outer">
      <div class="inner">
        <img :src="require(`@/assets/icons/${option.icon}.svg`)" alt="popup-icon">
        <div class="message">
          <span v-if="option.message" v-html="option.message"></span>
          <slot v-else></slot>
        </div>
        <div class="buttons">
          <button
            class="default"
            @click="emits('close');"
          >
            {{ option.type === 'alert' ? '확인' : '취소' }}
          </button>
          <button
            v-if="option.submit"
            :class="option.submit.type"
            @click="option.submit.callback()"
          >
            {{ option.submit.text }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#popup {
  @extend .shadow;
  z-index: 20;
  background-color: #00000070;

  * {
    font-family: 'Galmuri9';
    font-size: 14px;
  }

  .outer {
    width: 300px;
    background-color: $base-color;

    .inner {
      @extend .flex-center;
      flex-direction: column;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border: 1px solid $text-color;
      margin: 5px;
      gap: 30px;
      padding: 20px;

      img {
        width: 30px;
        height: 30px;
        filter: $image-filter;
        opacity: 0.7;
      }

      .message {
        width: inherit;
        margin-bottom: 10px;
        overflow: hidden;

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
          
          &.request {
            background-color: #32cd3230;
          }

          &.warning {
            background-color: #b2222270;
          }
        }
      }
    }
  }
}
</style>