<script setup lang="ts">
import { computed, ref } from 'vue';
import VWrapper from './base/VWrapper.vue';
import VItem from './base/VItem.vue';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { projects, isMobile } = storeToRefs(dataStore);

const color = ref(false);
const projectIndex = ref(0);
const project = computed(() => projects.value[projectIndex.value]);

const isFirstProject = computed(() => projectIndex.value === 0);
const isLastProject = computed(() => projectIndex.value === projects.value.length - 1);

const projectImage = computed(() => {
  const id = project.value.id;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const src = require(`@/assets/images/${id}.gif`);
  return `url(${src})`;
})

function prev() {
  if (!isFirstProject.value)
   projectIndex.value -= 1;
}

function next() {
  if (!isLastProject.value)
    projectIndex.value += 1;
}
</script>

<template>
  <VWrapper id="project" title="side projects">
    <div class="view">
      <div
        class="image"
        :style="{ backgroundImage : projectImage }"
        @click="color = !color"
        :class="{ color : color }"
      />
      <div class="summary">
        <VItem icon="link">
          <template #text>
            <a
              :href="project.link"
              target="_blank"
              :style="{ textDecoration : 'underline' }"
            >
              {{ project.name }}
            </a>
          </template>
        </VItem>
        <VItem icon="calendar" :text="`${project.from} - ${project.to}`"/>
        <VItem icon="terminal" :text="project.keywords.join(' ・ ')" />
        <VItem icon="annotation">
          <template #text>
            <span>{{ project.comment }}</span>
          </template>
          <template #subitem>
            <div class="details">
              <span
                v-for="(detail, i) of project.details"
                :key="i"
              >{{ detail }}</span>
            </div>
          </template>
        </VItem>
      </div>
      <div class="paging">
        <div>
          <button @click="prev" :disabled="isFirstProject" />
          <span>{{ projectIndex + 1 }} / {{ projects.length }}</span>
          <button @click="next" :disabled="isLastProject" />
        </div>
      </div>
    </div>
  </VWrapper>
</template>
