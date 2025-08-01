<script setup lang="ts">
import VItem from './base/VItem.vue';
import VWrapper from './base/VWrapper.vue';

async function open(id: string) {
  window.open(`https://drive.google.com/file/d/${id}/view?usp=drive_link`, '_blank');
}
</script>

<template>
  <div class="wrapper">
    <VWrapper id="resume">
      <div class="view">
        <VItem
          icon="attachment"
          @click="open('1ZPIVyJn1TUtJwRvbDQVE2cfRc8cZt2Lf')"
        >
          <template #text>
            <span>이력서</span>
          </template>
        </VItem>
      </div>
    </VWrapper>
    <VWrapper id="career">
      <div class="view">
        <VItem
          icon="attachment"
          @click="open('13u9Y8Mq-y6ym-Wy1LaBwMq_vOsKHzeIi')"
        >
          <template #text>
            <span>경력기술서</span>
          </template>
        </VItem>
      </div>
    </VWrapper>
  </div>
</template>
