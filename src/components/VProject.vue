<script setup lang="ts">
import { computed, ref } from 'vue';
import VWrapper from './base/VWrapper.vue';
import { projects } from '@/constants';
import VItem from './base/VItem.vue';

const color = ref(false);
const projectIndex = ref(0);
const project = computed(() => projects[projectIndex.value]);

const isFirstProject = computed(() => projectIndex.value === 0);
const isLastProject = computed(() => projectIndex.value === projects.length - 1);

const projectImage = computed(() => {
  const id = projects[projectIndex.value].id;
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

<style lang="scss" scoped>
.view {
  height: calc(100% - 16px);
  display: grid;
  grid-template-rows: 290px 1fr 14px;
  gap: 10px;

  .image {
    @extend .flex-center;
    @extend .bg-image-center;
    width: 100%;
    transition: 500ms;
    background-color: #00000030;
    filter: grayscale(1) opacity(0.7);

    &.color {
      filter: none;
    }
  }

  :deep(a) {
    color: $text-color;
    text-decoration: none;
  }
}

.summary {
  @extend .base-view;

  .details {
    display: flex;
    flex-direction: column;
    gap: 10px;

    span {
      opacity: 0.6;
      margin-left: 27px;
    }
  }
}

.paging {
  @extend .label;
  display: flex;
  justify-content: right;
  width: 100%;
  align-items: center;
  background-color: transparent;
  margin-top: 10px;

  div {
    display: inline-flex;
    align-items: center;

    button {
      @extend .bg-image-center;
      @include icon(arrow-right-normal);
      background-size: auto !important;
      padding: 0;

      &:first-child {
        transform: rotate(-180deg);
      }

      &:disabled {
        opacity: 0.3;
      }
    }

    span {
      display: inline-block;
      width: 40px;
      text-align: center;
    }
  }
}
</style>