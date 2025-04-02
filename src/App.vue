<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useZoomStore } from './stores/zoomStore';
import VSkills from './components/VSkills.vue';
import VCompany from './components/VCompany.vue';
import VProfile from './components/VProfile.vue';
import VNavigation from './components/VNavigation.vue';
import VProject from './components/VProject.vue';
import VArchive from './components/VArchive.vue';
import VArticle from './components/VArticle.vue';
import VPopup from './components/VPopup.vue';
import dayjs from 'dayjs';

const zoom = useZoomStore();

const target = ref();
const lastBuild = ref();

onMounted(async () => {
  // preloadImage(projects);
  const buildDate = document.documentElement.dataset.build;
  lastBuild.value = dayjs(buildDate).format('YYYY-MM-DD');
});
</script>

<template>
  <main id="root">
    <VNavigation v-if="!target"/>
    <div id="container" :style="zoom.style">
      <!-- header -->
      <header>
        <img :src="require('@/assets/images/profile.png')" alt="profile">
        <h1>Yu Jin</h1>
      </header>
      <!-- main -->
      <VProfile />
      <VSkills />
      <VCompany @load="(file) => target = file"/>
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
    @close="() => target = undefined"
  />
  <VPopup />
</template>

<style lang="scss">
@import 'assets/styles';
</style>