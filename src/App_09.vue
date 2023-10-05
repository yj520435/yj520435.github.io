<template>
  <div id="app-wrapper">
    <section id="blank"></section>
    <h1>yours truly</h1>
    <section id="profile">
      <div><img src="@/assets/bear.png" alt="profile"></div>
    </section>
    <section id="tags">
      <div @click="open">archive</div>
      <div>day</div>
      <div>book</div>
    </section>
  </div>
  <MainLayout />
  <!-- <div id="footer">
    <span @click="setYear">2023</span>
  </div> -->
  <div id="modal" v-if="modalOn">
    <ul>
      <li>2021</li>
      <li>2022</li>
      <li>2023</li>
    </ul>
    <div>
      <span>CANCEL</span>
      <span>OK</span>
    </div>
  </div>
</template>

<script setup>
import {  ref } from 'vue'
import MainLayout from '@/components/MainLayout.vue'

const modalOn = ref(false)

// const setYear = () => {
//   modalOn.value = true;
//   document.getElementsByTagName('html')[0].style.overflow = 'hidden'
//   window.addEventListener('wheel', (e) => {
//     console.log(e)
//   })
// }

const open = () => {
  modalOn.value = true;
}

// const posts = inject('posts')
// console.log(ref)

// export default {
//   name: 'App',
//   components: {
//     MainLayout
//   },
//   setup() {
//     const posts = inject('posts')

//     const isFirst = ref(false)
//     const isLast = ref(false)

//     let layoutType = ref(true)

//     const contents = ref('')

//     return {
//       posts,
//       contents,
//       isFirst,
//       isLast,
//       layoutType
//     }
//   },
//   methods: {
//     goPrev() {
//       const prev = this.posts.findIndex(v => v.index === this.$route.params.index) - 1
//       this.$router.push(`/${this.posts[prev].index}`)
//     },
//     goNext() {
//       const next = this.posts.findIndex(v => v.index === this.$route.params.index) + 1
//       this.$router.push(`/${this.posts[next].index}`)
//     },
//     toggle() {
//       const current = this.$router.currentRoute.value.path
      
//       if (current.includes('archive'))
//         this.$router.push('/')
//       else
//         this.$router.push('/archive')
//     },
//     toggleLayoutType(params) {
//       this.$router.push(`/archive`)
//       this.layoutType = params
//       console.log(params)
//     },
//     setYear() {
//       alert(1)
//     }
//   }
// }
</script>