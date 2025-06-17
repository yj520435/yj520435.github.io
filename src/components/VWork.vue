<script setup lang="ts">
import { works } from '@/constants';
import VWrapper from './base/VWrapper.vue';
import { Work } from '@/types';
import { defineEmits } from 'vue';
import VItem from './base/VItem.vue';

const emits = defineEmits(['load']);

function loadWork(work: Work) {
  if (work.id.startsWith('-'))
    return;

  emits('load', {
    id: work.id,
    name: work.name,
    mimeType: 'text/x-markdown',
    kind: ''
  });
}
</script>

<template>
  <VWrapper id="work" title="work experience">
    <div class="view">
      <VItem
        v-for="work of works"
        :key="work.id"
        icon="pin"
        :text="work.name"
      >
        <template #subitem>
          <div class="details">
            {{ work.from }} - {{ work.to }} <span class="divider" />
            {{ work.department }} <span class="divider" />
            {{ work.position }}
          </div>
          <div class="tasks">
            <span
              v-for="(task, i) of work.tasks"
              :key="i"
            >
              {{ task }}
            </span>
          </div>
        </template>
      </VItem>
    </div>
  </VWrapper>
</template>

<style lang="scss" scoped>
.view {
  @extend .base-view;

  :deep(.item) {
    width: 100%;

    .text {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .active {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .details {
    margin-left: 27px;

    .divider::after {
      content: '|';
      display: inline-block;
      color: #dddddd40;
      text-align: center;
      margin: 0 6px;
    }
  }

  .tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;

    span {
      opacity: 0.6;
      margin-left: 27px;
    }
  }
}
</style>