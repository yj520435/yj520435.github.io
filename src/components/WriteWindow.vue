<template>
  <div class="write border-radius-16">
    <div class="grid-2">
      <input>
      <img
        src="../assets/check.svg"
        @mouseover="showBeauty"
        @mouseout="beauty = false"
        alt=""/>
    </div>
    <textarea></textarea>
    <figure class="loading">
      <div class="bar">
        <div class="circle"></div>
      </div>
    </figure>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const beauty = ref(false)

const showBeauty = () => {
  beauty.value = true
}
</script>