<template>
  <div id="basic-layout-wrapper">
    <section id="post">
      <div v-html="contents"></div>
    </section>
    <section id="pager">
      <button
        @click="goPrev"
        @mousedown="downButton"
        @mouseup="upButton"
        :class="{ disabled : !prevAndNext[0] }"
        :disabled="!prevAndNext[0]"
      >&lt;</button>
      <button
        @click="goNext"
        @mousedown="downButton"
        @mouseup="upButton"
        :class="{ disabled : !prevAndNext[1] }"
        :disabled="!prevAndNext[1]"
      >&gt;</button>
    </section>
    <section id="blank"></section>
  </div>
</template>
<script>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'BasicLayout',
  props: {
    posts: Array,
  },
  setup(props) {
    const contents = ref('')
    const prevAndNext = ref([0, 0])

    const route = useRoute()
    
    const getPrevAndNext = (params) => {
      let order = props.posts.findIndex(v => v.id === +params)
      const prev = (order !== 0) ?  props.posts[order - 1].id : undefined
      const next = (order !== props.posts.length - 1) ?  props.posts[order + 1].id : undefined
      prevAndNext.value = [prev, next]

      console.log(params, prevAndNext.value)
    }

    const getContents = (params) => {
      contents.value = ''
      const post = props.posts.find(v => v.id === +params)
      for (const line of post.contents)
        contents.value += line
    }

    const getImageLayout = async () => {
      const articles = document.getElementsByTagName('article')
      await nextTick()
      for (const article of articles) {
        if (article.children.length === 2)
          article.classList.add('flex-2')
      }
    }

    watch(route, () => {
      const currentId = route.params.id
      if (currentId !== undefined && currentId !== 'archive') {
        getPrevAndNext(currentId)
        getContents(currentId)
        getImageLayout()
      }
    })

    onMounted(() => {
      const currentId = route.params.id
      if (currentId) {
        getPrevAndNext(currentId)
        getContents(currentId)
        getImageLayout()
      }
    })

    return {
      contents,
      prevAndNext,
    }
  },
  methods: {
    goPrev() {
      if (this.prevAndNext[0] !== undefined)
        this.$router.push(`/${this.prevAndNext[0]}`)
    },
    goNext() {
      if (this.prevAndNext[1] !== undefined)
        this.$router.push(`/${this.prevAndNext[1]}`)
    },
    downButton(event) {
      event.target.style.width = '36px'
      event.target.style.height = '36px'
      event.target.style.margin = '0 12px'
    },
    upButton(event) {
      event.target.style.width = '40px'
      event.target.style.height = '40px'
      event.target.style.margin = '0 10px'
    }
  }
}
</script>
<style>
#basic-layout-wrapper {
  height: calc(100vh - 336px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#post img {
  background-color: #f9f9f9;
}
</style>