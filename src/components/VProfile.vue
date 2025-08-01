<script setup lang="ts">
import { useDataStore } from '@/stores/dataStore';
import VItem from './base/VItem.vue';
import VWrapper from './base/VWrapper.vue';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { isMobile } = storeToRefs(dataStore);
</script>

<template>
  <VWrapper id="profile">
    <div class="view">
      <p>김유진 (1994. 05)</p>
      <p>주니어 웹 개발자</p>
    </div>
  </VWrapper>
  <div class="wrapper">
    <VWrapper id="education">
      <div class="view">
        <VItem icon="graduation">
          <template v-if="isMobile" #text>
            <span>인천대학교</span>
            <span>컴퓨터공학부</span>
          </template>
          <template v-else #text>
            인천대학교 컴퓨터공학부
          </template>
        </VItem>
      </div>
    </VWrapper>
    <VWrapper id="certification">
      <div class="view">
        <VItem icon="certification">
          <template v-if="isMobile" #text>
            <span>정보처리기사</span>
            <span>(2017. 11)</span>
          </template>
          <template v-else #text>
            정보처리기사
          </template>
        </VItem>
      </div>
    </VWrapper>
  </div>
</template>
