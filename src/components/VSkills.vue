<script setup lang="ts">
import { skills } from '@/constants';
import VWrapper from './base/VWrapper.vue';
import VItem from './base/VItem.vue';

</script>

<template>
  <VWrapper id="skills">
    <div class="view">
      <VItem
        v-for="skill of skills"
        :key="skill.id"
        icon="container"
      >
        <template #text>
          <span class="name">{{ skill.id }}</span>
          <span>&gt;</span>
          <span>{{ skill.items?.join(' ・ ') }}</span>
        </template>
      </VItem>
    </div>
  </VWrapper>
</template>

<style lang="scss" scoped>
.view {
  @extend .base-view;

  :deep(.text) {
    display: inline-grid;
    grid-template-columns: 90px 20px 1fr;
  }
}
</style>