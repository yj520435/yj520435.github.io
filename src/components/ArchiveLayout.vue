<template>
  <div id="archive-layout-wrapper">
    <section class="archive" v-for="columnIndex of columnCount" :key="columnIndex">
      <div
        v-for="post of postArray(posts, columnIndex-1)"
        :key="post.id"
        class="post"
        v-html="getContents(post.contents)"
        >
      </div>
    </section>
  </div>
  <section id="blank"></section>
</template>
<script>
import { nextTick, onMounted, ref } from 'vue'
export default {
  name: 'ArchiveLayout',
  props: {
    posts: Array,
  },
  setup(props) {
    const columnCount = ref(0)

    const calcColumnCount = () => {
      const innerWidth = window.innerWidth;
      const count = Math.floor(innerWidth / 430)
      columnCount.value = props.posts.length < count ? props.posts.length : count
    }

    const getImageLayout = async () => {
      const articles = document.getElementsByTagName('article')
      await nextTick()
      for (const article of articles) {
        if (article.children.length === 2)
          article.classList.add('flex-2')
      }
    }

    onMounted(async () => {
      calcColumnCount()
      getImageLayout()
      window.addEventListener('resize', calcColumnCount)
    })

    return {
      columnCount
    }
  },
  methods: {
    postArray(posts, columnIndex) {
      console.log('## posts', posts)
      console.log('## columnIndex', columnIndex)
      let array = []
      for (let [index, post] of posts.entries()) {
         if ((index % this.columnCount) === columnIndex)
          array.push(post)
      }
      return array
    },
    getContents(contents) {
      console.log('##', contents)
      let text = ''
      for (const line of contents) {
        text += line
      }
      return text
    }
  }
}
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

.archive {
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: flex-start;
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
}

.post img {
  width: 100%;
  background-color: #f9f9f9;
}
</style>
