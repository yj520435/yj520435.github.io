<script setup lang="ts">
import { h, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import VSkills from './components/VSkills.vue';
import VWork from './components/VWork.vue';
import VProfile from './components/VProfile.vue';
import VNavigation from './components/VNavigation.vue';
import VProject from './components/VProject.vue';
import VArchive from './components/VArchive.vue';
import VArticle from './components/VArticle.vue';
import VAttach from './components/VAttach.vue';
import VContact from './components/VContact.vue';
import dayjs from 'dayjs';
import { File } from './types';
import { useDataStore } from './stores/dataStore';
import { storeToRefs } from 'pinia';

const target: Ref<File | undefined> = ref();
const filter: Ref<string> = ref('');

const show = ref(false);
const componentItems = ref([
  { id: 'profile', to: '#body', is: h(VProfile) },
  { id: 'skill', to: '#body', is: h(VSkills) },
  { id: 'work', to: '#body', is: h(VWork) },
  { id: 'attach', to: '#body', is: h(VAttach) },
  { id: 'project', to: '#body', is: h(VProject) },
  { id: 'archive', to: '#body', is: h(VArchive, { onLoad: (file) => target.value = file }) },
  { id: 'contact', to: '#body', is: h(VContact) },
]);

const columnNum = ref(0);
const columnMap = new Map()
  .set(1, [componentItems.value.map((v) => v.id)])
  .set(2, [['profile', 'work', 'attach', 'archive'], ['skill', 'project', 'contact']])
  .set(3, [['profile', 'skill', 'archive'], ['project'], ['work', 'attach', 'contact']]);

const dataStore = useDataStore();
const { isMobile } = storeToRefs(dataStore);

function resize() {
  const width = window.innerWidth;
  if (width > 1700)
    columnNum.value = 3;
  else if (width > 1200)
    columnNum.value = 2;
  else
    columnNum.value = 1;

  dataStore.setIsMobile(width < 520);
}

watch(columnNum, (v: number) => {
  (columnMap.get(v) as Array<string[]>).forEach((array, index) => {
    componentItems.value.filter((item) => array.includes(item.id)).forEach((x) => {
      x.to = `.body-${v} .column-${index + 1}`;
    });
  });
});

const lastBuild = ref();

onMounted(async () => {
  // preloadImage(projects);
  const buildDate = document.documentElement.dataset.build;
  lastBuild.value = dayjs(buildDate).format('YYYY-MM-DD');  

  resize();
  show.value = true;
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <main id="root" :class="{ mobile : isMobile }" :style="{ filter }">
    <VNavigation />
    <div id="container">
      <!-- header -->
      <header>
        <img :src="require('@/assets/images/profile.png')" alt="profile">
        <h1>Yu Jin</h1>
      </header>
      <!-- rendered body -->
      <div id="body" :class="`body-${columnNum}`">
        <div v-for="i of columnNum" :key="i" :class="`column-${i}`"></div>
      </div>
      <!-- hidden import area -->
      <div v-if="show">
        <Teleport :to="item.to" v-for="(item, i) of componentItems" :key="i">
          <component :is="item.is"></component>
        </Teleport>
      </div>
      <!-- footer -->
      <footer>
        <span>Last Updated {{ lastBuild }}</span>
      </footer>
    </div>
  </main>
  <VArticle
    :file="target"
    @load="() => filter = 'blur(10px)'"
    @close="() => { target = undefined; filter = ''; }"
  />
</template>

<style lang="scss">
@import 'assets/styles';
</style>