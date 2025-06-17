<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import VSkills from './components/VSkills.vue';
import VWork from './components/VWork.vue';
import VProfile from './components/VProfile.vue';
import VNavigation from './components/VNavigation.vue';
import VProject from './components/VProject.vue';
import VArchive from './components/VArchive.vue';
import VArticle from './components/VArticle.vue';
import dayjs from 'dayjs';
import { File } from './types';

const target: Ref<File | undefined> = ref();
const lastBuild = ref();

onMounted(async () => {
  // preloadImage(projects);
  const buildDate = document.documentElement.dataset.build;
  lastBuild.value = dayjs(buildDate).format('YYYY-MM-DD');
});
</script>

<template>
  <main id="root">
    <VNavigation />
    <div id="container">
      <!-- header -->
      <header>
        <img :src="require('@/assets/images/profile.png')" alt="profile">
        <h1>Yu Jin</h1>
      </header>
      <!-- main -->
      <VProfile />
      <VSkills />
      <VWork @load="(file) => target = file"/>
      <VProject />
      <VArchive @load="(file) => target = file"/>
      <!-- footer -->
      <footer>
        <span>Last Updated {{ lastBuild }}</span>
      </footer>
    </div>
  </main>
  <VArticle
    :file="target"
    @load="(file) => target = file"
    @close="() => target = undefined"
  />
</template>

<style lang="scss">
@import 'assets/styles';
</style>