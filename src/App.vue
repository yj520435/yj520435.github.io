<template>
  <div id="app-wrapper">
    <section id="blank"></section>
    <h1>title</h1>
    <section id="profile">
      <div><img src="@/assets/bear.png" alt="profile"></div>
    </section>
    <section id="tags">
      <div @click="toggle" style="cursor: pointer;">toggle</div>
      <div>write</div>
    </section>
  </div>
  <router-view v-slot="{ Component, route }">
    <transition>
      <div :key="route.name" style="width: 100%">
        <component :is="Component" :posts="posts"/>
      </div>
    </transition>
  </router-view>
  <div id="footer">
    <span @click="setYear">2023</span>
  </div>
</template>

<script>
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const posts = inject('posts')

    const isFirst = ref(false)
    const isLast = ref(false)

    let layoutType = ref(true)

    watch(route, () => {
      if (route.fullPath === '/')
        router.push('/2023')
    })

    const contents = ref('')

    return {
      posts,
      contents,
      isFirst,
      isLast,
      layoutType
    }
  },
  methods: {
    goPrev() {
      const prev = this.posts.findIndex(v => v.index === this.$route.params.index) - 1
      this.$router.push(`/${this.posts[prev].index}`)
    },
    goNext() {
      const next = this.posts.findIndex(v => v.index === this.$route.params.index) + 1
      this.$router.push(`/${this.posts[next].index}`)
    },
    toggle() {
      const current = this.$router.currentRoute.value.path
      
      if (current.includes('archive'))
        this.$router.push('/')
      else
        this.$router.push('/archive')
    },
    toggleLayoutType(params) {
      this.$router.push(`/archive`)
      this.layoutType = params
      console.log(params)
    },
    setYear() {
      alert(1)
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'BMJUA';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: #C8BFE7;
}

body::-webkit-scrollbar {
  display: none;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-family: 'BMJUA';
  font-size: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

#app-wrapper {
  z-index: 100;
  background-color: #C8BFE7;
  width: 100%;
}

#blank {
  width: 100%;
  height: 70px;
}

h1 {
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  color: #4e7a9f;
  text-shadow: 5px 5px white;
}

#profile {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

#profile div {
  width: 70px;
  height: 70px;
  padding: 15px;
  border-radius: 50%;
  border: 5px solid #4e7a9f;
  background-color: #ffffff;
}

#profile div img {
  width: 100%;
}

#tags {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 20px 0;
}

#tags div {
  padding: 5px 11px;
  margin: 0 5px;
  background-color: rgba(78, 122, 159, 1.0);
  border: 5px solid #ffffff;
  color: white;
  border-radius: 10px;
}

h3 {
  margin: 0;
}

.flex-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.flex-2 img {
  width: 100%;
}

#post {
  width: 560px;
  height: calc(100% - 130px);
  border-radius: 20px;
  background-color: #ffffff;
  border: 5px solid #4e7a9f;
  padding: 20px;
  box-sizing: border-box;
  text-align: left;
  color: #4e7a9f;
}

#post div:nth-child(1) {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  word-wrap: break-word;
  line-height: 1.3;
}

#post div:nth-child(1)::-webkit-scrollbar {
  display: none;
  width: 5px;
  background-color: rgba(200, 191, 231, 0.3);
  border-radius: 15px;
}

#post div:nth-child(1)::-webkit-scrollbar-thumb {
  background-color: rgb(200, 191, 231);
  border-radius: 10px;
}

mark {
  background-color: #ffe364;
  color: #4e7a9f;
}

#pager {
  display: flex;
  align-items: center;
  padding-top: 20px;
}

#pager button {
  background-color: #ffffff;
  border: 5px solid #4e7a9f;
  border-radius: 10px;
  margin: 0 10px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: #4e7a9f;
  font-family: '긱블말랑이';
  cursor: pointer;
}

.disabled {
  border-color: #aaaaaa !important;
  color: #aaaaaa !important;
  /* cursor: not-allowed !important; */
}

p {
  margin: 20px 0;
}

q {
  display: block;
  border-left: 7px solid #dddddd;
  padding-left: 7px;
  margin: 20px 0;
}

q::before,
q::after {
  content: none;
}

code {
  font-family: 'Ubuntu Mono';
  background-color: #4e7a9f;
  border-radius: 5px;
  padding: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

pre {
  font-family: 'Ubuntu Mono';
  font-weight: bold;
  font-size: 16px;
  color: #999999;
  background-color: #eeeeee;
  border-radius: 5px;
  padding: 5px;
}

.post-date {
  font-size: 18px;
  color: #C8BFE7;
  margin: 20px 0 0 0;
  text-align: right;
}

#footer {
  position: fixed;
  right: 10px;
  bottom: 10px;
  color: white;
  padding: 10px 0px 10px 10px;
  transform: rotate(-30deg);
  font-size: 20px;
}

#footer span {
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: all 1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  height: 0px;
  transform: translateY(1000px);
}

</style>
