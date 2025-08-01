<script setup lang="ts">
import VWrapper from './base/VWrapper.vue';
import VItem from './base/VItem.vue';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { works } = storeToRefs(dataStore);
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
