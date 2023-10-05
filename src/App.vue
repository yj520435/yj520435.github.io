<template>
  <main>
    <section class="icons">
      <div class="icon">
        <img :src="require('@/assets/bubble.svg')" alt="img">
        <span>블로그</span>
      </div>
    </section>
  </main>
  <component :is="MyWindow" :data="'Blog'" />
  <component :is="MyWindow" :data="'Write'" />
  <!-- <MyWindow>
    <BlogWindow :width="600" :height="600"/>
  </MyWindow> -->
</template>

<script setup>
import MyWindow from '@/components/MyWindow.vue'
// import BlogWindow from '@/components/BlogWindow.vue'



</script>