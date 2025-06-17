<script setup lang="ts">
import { companies } from '@/constants';
import VWrapper from './base/VWrapper.vue';
import { Company } from '@/types';
import { defineEmits } from 'vue';
import VItem from './base/VItem.vue';

const emits = defineEmits(['load']);

function loadCompany(company: Company) {
  if (company.id.startsWith('-'))
    return;

  emits('load', {
    id: company.id,
    name: company.name,
    mimeType: 'text/x-markdown',
    kind: ''
  });
}
</script>

<template>
  <VWrapper id="company" title="work experience">
    <div class="view">
      <VItem
        v-for="company of companies"
        :key="company.id"
        icon="pin"
      >
        <template #text>
          <span
            @click="loadCompany(company)"
            :class="{ active : !company.id.startsWith('-') }"
          >
            {{ company.name }}
          </span>
          <span>{{ company.from }} - {{ company.to }}</span>
        </template>
        <template #subitem>
          <div class="tasks">
            <span
              v-for="(task, i) of company.tasks"
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

  .tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;

    span {
      opacity: 0.6;
      margin-left: 27px;
    }
  }
}
</style>