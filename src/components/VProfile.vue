<script setup lang="ts">
import VItem from './base/VItem.vue';
import VWrapper from './base/VWrapper.vue';
import { profile } from '@/constants';

const { name, birth, whoAmI, univ, certs } = profile
</script>

<template>
  <VWrapper id="profile">
    <div class="view">
      <p>{{ name }} ({{ birth }})</p>
      <p>{{ whoAmI }}</p>
    </div>
  </VWrapper>
  <div class="wrapper">
    <VWrapper id="education">
      <div class="view">
        <VItem icon="graduation">
          <template #text>
            <span class="full">{{ univ.name.kor }}</span>
            <a
              class="abbr"
              :href="univ.url"
              target="_blank"
            >{{ univ.name.eng }}</a>
            {{ univ.major }}
          </template>
        </VItem>
      </div>
    </VWrapper>
    <VWrapper id="certification">
      <div class="view">
        <VItem icon="certification" :text="certs" />
      </div>
    </VWrapper>
  </div>
</template>
