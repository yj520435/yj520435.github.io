<template>
  <div id="archive-layout-wrapper">
    <section
      class="archive"
      :class="{ mobile : isMobile }"
      v-for="columnIndex of columnCount"
      :key="columnIndex"
    >
      <div
        v-for="post of postArray(posts, columnIndex-1)"
        :key="post.id"
        class="post"
        :class="{ mobile : isMobile }"
        v-html="getContents(post)"
        >
      </div>
    </section>
  </div>
  <div
    id="focus-layout-wrapper"
    v-if="zoom.status"
    @click="zoom.status = false"
  >
    <img :src="`${zoom.target}`" alt="">
  </div>
  <section id="blank"></section>
</template>
<script setup>
// import { nextTick, onMounted, ref, watch } from 'vue'
import { nextTick, ref } from 'vue'
import moment from 'moment'

const columnCount = ref(0)
const isMobile = ref(false)
const year = ref(2023)

const zoom = ref({ status: false, target: null})

const posts = ref([])

const calcColumnCount = async () => {
  const innerWidth = window.innerWidth
  let count = Math.floor(innerWidth / 440)
  count = (count === 0) ? 1 : count
  columnCount.value = posts.value.length < count ? posts.value.length : count

  console.log('###', columnCount.value)

  await nextTick()
  isMobile.value = window.innerWidth < 510
}

const postArray = (posts, columnIndex) => {
  console.log('##', posts)
  let array = []
  for (let [index, post] of posts.entries()) {
    if ((index % columnCount.value) === columnIndex)
      array.push(post)
  }
  return array
}

const getContents = (post) => {
  let text = ''
  for (const line of post.contents)
    text += line
  text += `<p class="date">${moment(post.id, 'YYYYMMDDhh').format('YYYY-MM-DD')}</p>`

  let parser = new DOMParser();
  let doc = parser.parseFromString(text, 'text/html')

  // images
  let images = doc.getElementsByTagName('img')
  for (let image of images)
    image.src = `https://drive.google.com/uc?id=${image.alt}`

  return doc.body.innerHTML
}

const getImageLayout = async() => {
  const articles = document.getElementsByTagName('article')
  await nextTick()
  for (const article of articles) {
    if (article.children.length % 2 === 0)
      article.classList.add('flex-2')
  }
}

import(/* @vite-ignore */ `../../posts/${year.value}.json`).then(result => {
  posts.value = result.default;
  console.log(posts.value)
  calcColumnCount();
  getImageLayout();
})

</script>
<style>
#archive-layout-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: unset;
  justify-content: center;
}

#focus-layout-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  isolation: isolate;
  background-color: #4e7a9f;
}

/* #cover {
  width: 100%;
  height: 100vh;
  z-index: 201;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7)
} */

#focus-layout-wrapper img {
  width: 90%;
  max-width: 900px;
  z-index: 202;
}

.archive {
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: flex-start;
}

.archive.mobile {
  width: 100%;
  gap: 20px;
}

.post {
  width: 410px;
  height: fit-content;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-sizing: border-box;
  border: 5px solid #4e7a9f;
  color: #4e7a9f;
  position: relative;
  text-align: left;
  line-height: 1.3;
  font-size: 22px;
}

.post.mobile {
  width: 100%;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

.post img {
  width: 100%;
  background-color: #f9f9f9;
}

.date {
  color: #C8BFE7;
  font-size: 16px;
  margin: 0;
  margin-top: 20px;
  text-align: right;
}

#post {
  width: 560px;
  height: 400px;
  background-color: white;
  border-radius: 20px;
  border: 5px solid #C8BFE7;
}

</style>
