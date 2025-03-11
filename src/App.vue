<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { File } from './types';
import { addMouseEvent, filterAndSort, getIcon, loadFile, loadFolder, preloadImage } from './utils';
import { Converter } from 'showdown';
import { useItemStore } from './store';
import { ARCHIVE_ROOT, companies, FOLDER_MIME_TYPE, projects, skills } from './constants';
import dayjs from 'dayjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'

const store = useItemStore();

// Zoom & Scale
const scale = ref(1);
const zoom = ref(false);
const style = computed(() => `transform: scale(${scale.value})`);

function resize(event?: any) {
  const width = event ? event.target.innerWidth : window.innerWidth;
  scale.value = 1 + (width - 500) * (0.3 / 1420);
}

watch(zoom, (v) => {
  if (v) {
    resize();
    window.addEventListener('resize', resize);
  }
  else {
    scale.value = 1;
    window.removeEventListener('resize', resize);
  }
})

// Projects
const color = ref(false);
const projectIndex = ref(0);
const project = computed(() => projects[projectIndex.value]);
const isFirstProject = computed(() => projectIndex.value === 0);
const isLastProject = computed(() => projectIndex.value === projects.length - 1);
const projectImage = computed(() => {
  const id = projects[projectIndex.value].id;
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

// Archives
const files: Ref<File[]> = ref([]);
const loading: Ref<boolean> = ref(true);
const paths: Ref<string[]> = ref([]);
const article: any = ref();

const isRoot = computed(() => paths.value[paths.value.length - 1] === ARCHIVE_ROOT);

watch(paths, async (value) => {
  const id = value[value.length - 1];
  await load(id);
}, {
  deep: true
})

async function load(id: string) {
  files.value = [];
  loading.value = true;

  const storedFiles = store.get(id);

  if (storedFiles) {
    files.value = storedFiles.items;
  } else {
    const result = await loadFolder(id);
    if (result.length > 0)
      files.value = filterAndSort(result);
    store.set(id, files.value);
  }

  loading.value = false;
}

async function open(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE)
    paths.value.push(file.id);
  else
    await read(file);
}

// Article
const shadow = ref(false);
const reading: Ref<boolean> = ref(true);
const show = ref('show');

const markdown = ref('');
const html = ref();
const converter = new Converter({ tables: true, simpleLineBreaks: true });
const articleRef = ref();

async function read(file: any) {
  if (!('id' in file))
    return

  article.value = file;
  shadow.value = true;
  markdown.value = await loadFile(file.id);
  html.value = converter.makeHtml(`${markdown.value}`);

  reading.value = false;

  setTimeout(() => {
    // highlight
    hljs.highlightAll();

    // mouse event
    const codeblocks = articleRef.value.querySelectorAll('pre code');
    addMouseEvent(codeblocks);
  }, 500);
}

function close() {
  shadow.value = false;
  reading.value = true;
}

function wheel(event: WheelEvent) {
  const el = articleRef.value;
  if (el.clientHeight < el.scrollHeight)
    show.value = event.deltaY < 0 ? 'show' : 'hide';
}

// Footer
const lastBuild = ref()

onMounted(async () => {
  preloadImage(projects);
  paths.value.push(ARCHIVE_ROOT);
  lastBuild.value = document.documentElement.dataset.build;
})
</script>

<template>
  <main id="root" class="scroll">
    <nav v-if="!shadow">
      <div>
        <!-- <button
          class="admin"
          :style="style"
          @click="login"
        /> -->
        <button
          class="zoom"
          :class="zoom ? 'minimize' : 'maximize'"
          :style="style"
          @click="zoom = !zoom"
        />
      </div>
    </nav>
    <div :style="style">
      <header>
        <div id="avatar">
          <img :src="require('@/assets/images/profile.png')" alt="">
        </div>
        <h1>Yu Jin</h1>
      </header>
      <!-- PROFILE -->
      <section id="profile">
        <span class="title">PROFILE</span>
        <div class="outline">
          <p>김유진 (1994. 05)</p>
          <p>주니어 웹 개발자</p>
        </div>
      </section>
      <div class="wrapper">
        <!-- EDUCATION -->
        <section id="education">
          <span class="title">EDUCATION</span>
          <ul class="outline list">
            <li>인천대학교 컴퓨터공학부</li>
          </ul>
        </section>
        <!-- CERTIFICATES -->
        <section id="certificates">
          <span class="title">CERTIFICATES</span>
          <ul class="outline list">
            <li>정보처리기사</li>
          </ul>
        </section>
      </div>
      <!-- SKILLS -->
      <section id="skills">
        <span class="title">SKILLS</span>
        <ul class="outline list">
          <li v-for="skill of skills" :key="skill.id">
            <span class="name">{{ skill.id }}</span>
            <span>&gt;</span>
            <span>{{ skill.items?.join(' ・ ') }}</span>
          </li>
        </ul>
      </section>
      <!-- CAREERS -->
      <section id="career">
        <span class="title">CAREER</span>
        <div class="outline">
          <ul
            v-for="company of companies"
            :key="company.id"
            class="list"
            :class="{ disabled : company.id.startsWith('-')}"
          >
            <li class="name" @click="() => {
                if (!company.id.startsWith('-'))
                  read(company)
              }">
              {{ company.name }}
            </li>
            <li class="date">
              {{ company.from }} - {{ company.to }}
            </li>
            <li class="dep">
              {{ company.department }} / {{ company.position }}
            </li>
            <li class="task">
              {{ company.tasks }}
            </li>
        </ul>
        </div>
      </section>
      <!-- PROJECTS -->
      <section id="project">
        <span class="title">SIDE PROJECT</span>
        <div class="outline">
          <article class="scroll">
            <div
              class="image"
              :style="{ backgroundImage : projectImage }"
              @click="color = !color"
              :class="{ color : color }"
            />
            <ul class="list">
              <li class="name">
                <a :href="project.link" target="_blank">
                  {{ project.name }}
                </a>
              </li>
              <li class="date">
                {{ project.from }} - {{ project.to }}
              </li>
              <li class="keywords">
                {{ project.keywords.join(' ・ ') }}
              </li>
              <li class="comment">
                <span v-html="project.comment" />
              </li>
            </ul>
          </article>
          <span class="counts">
            <button @click="prev" :disabled="isFirstProject" />
            <span>{{ projectIndex + 1 }} / {{ projects.length }}</span>
            <button @click="next" :disabled="isLastProject" />
          </span>
        </div>
      </section>
      <!-- ARCHIVE -->
      <section id="archive">
        <span class="title">ARCHIVE</span>
        <div v-if="loading" class="loading">
          <img :src="require('@/assets/icons/search.svg')" alt="loading">
        </div>
        <div v-else class="view">
          <ul class="list items">
            <li v-if="!isRoot" class="root" @click="paths = [ARCHIVE_ROOT]">.</li>
            <li v-if="!isRoot" class="back" @click="paths.pop()">..</li>
            <li
              v-for="file of files"
              :key="file.id"
              :class="getIcon(file.mimeType)"
              @click="open(file)"
            >
              {{ file.name }}
            </li>
          </ul>
          <!--
            <ul class="list options" v-if="'access_token' in auth">
              <li class="folder" @click="createFolder" />
              <li class="file" />
              <li class="setting" />
            </ul>
          -->
        </div>
      </section>
      <footer>
        <p>Last Updated {{ dayjs(lastBuild).format('YYYY-MM-DD') }}</p>
        <p>Contact Me yj520435@gmail.com</p>
      </footer>
    </div>
  </main>
  <!-- MODAL -->
  <main id="shadow" v-if="shadow" :style="style">
    <div v-if="reading" class="loading">
      <img :src="require('@/assets/icons/search.svg')" alt="loading">
    </div>
    <div
      v-else
      class="article"
      :style="{ height: `${(1 / scale) * 100}%` }"
    >
      <header :class="show">
        <span>{{ article.name }}</span>
        <button class="close" @click="close"/>
      </header>
      <article
        v-html="html"
        ref="articleRef"
        class="scroll"
        @wheel.passive="wheel"
      />
    </div>
  </main>
  <div id="secret" />
</template>

<style lang="scss">
@import 'assets/fonts', 'assets/style', 'assets/animation', 'assets/media';
</style>