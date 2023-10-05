<template>
  <div class="blog" @scroll="scroll" :class="{ 'border-radius-16' : !scrollEnd }">
    <section
      v-for="columnIndex of columnCount"
      :key="columnIndex"
    >
      <article
        v-for="post of postArray(posts, columnIndex - 1)"
        :key="post.id"
        class="post"
        v-html="getContents(post)"
      ></article>
    </section>
  </div>
  <div class="footer" v-show="scrollEnd" :class="{ 'border-radius-16' : scrollEnd }" />
</template>

<script setup >
import { nextTick, ref, defineProps, watch } from 'vue';
import moment from 'moment'
import allPosts from '../../posts/2023.json'

import(/* @vite-ignore */ `../../posts/2023.json`).then(result => {
  posts.value = result.default;
  console.log(posts.value)
  calcColumnCount();
  getImageLayout();
})

console.log(allPosts)

const props = defineProps({
  width: Number,
  height: Number
})

watch(() => props.width, (prev, next) => {
  if (prev / 440 !== next / 440)
    calcColumnCount()
})

// BLOG
const columnCount = ref(0)
const posts = ref([])

// eslint-disable-next-line no-unused-vars
const scrollEnd = ref(false)

const calcColumnCount = () => {
  let count = Math.floor(props.width / 440)
  count = (count === 0) ? 1 : count
  columnCount.value = posts.value.length < count ? posts.value.length : count
}

const postArray = (posts, columnIndex) => {
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
  const figures = document.getElementsByTagName('figure')
  await nextTick()
  for (const figure of figures) {
    if (figure.children.length % 2 === 0)
      figure.classList.add('flex-2')
  }
}

const scroll = (event) => {
  console.log(event.target.scrollTop, event.target.scrollHeight, props.height - 70)
  scrollEnd.value = (event.target.scrollHeight - event.target.scrollTop <= props.height)
  console.log(scrollEnd.value)
}

</script>