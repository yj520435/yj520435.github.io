<script setup lang="ts">
import VWrapper from './base/VWrapper.vue';
import VItem from './base/VItem.vue';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { skills } = storeToRefs(dataStore);
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
