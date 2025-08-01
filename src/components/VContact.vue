<script setup lang="ts">
import VItem from './base/VItem.vue';
import VWrapper from './base/VWrapper.vue';
</script>

<template>
  <VWrapper id="contact">
    <div class="view">
      <VItem icon="phone" text="010-8695-4830" />
      <VItem icon="mail" text="yj520435@gmail.com" />
      <VItem icon="code_snipet">
        <template #text>
          <a href="https://github.com/yj520435" target="_blank">https://github.com/yj520435</a>
        </template>
      </VItem>
    </div>
  </VWrapper>
</template>
