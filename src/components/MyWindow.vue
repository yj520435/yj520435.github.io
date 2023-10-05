<template>
  <div
    class="window"
    :style="`
      position: absolute;
      top: ${top}px; left: ${left}px;
      width: ${width}px; height: ${height}px;
    `"
    >
    <div
      class="title"
      @mouseover="cursor = 'grab'"
      @mousedown="initWindowPos"
    >
      윈도우
    </div>
    <div class="body">
      <Body :width="width" :height="height" />
    </div>
    <div
      class="size-controller"
      :style="`
        position: absolute;
        top: ${height - 27}px; left: ${width - 27}px;
      `"
      @mouseover="cursor = 'move'"
      @mousedown="ctrl = true">
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, defineProps, defineAsyncComponent } from 'vue';

const props = defineProps({
  data: String
})

console.log(props.data)

const Body = defineAsyncComponent({
  loader: () => import(`./${props.data}Window.vue`),
  loadingComponent: '<template><div>...</div></template>',
  delay: 1000,
  errorComponent: '<template><div>...</div></template>',
  timeout: 1000
})

// WINDOW
const top = ref(30)
const left = ref(30)
const width = ref(600)
const height = ref(600)

// MOVING
const point = ref({})
const fix = ref({})
const cursor = ref('default')
const ctrl = ref(false)
const click = ref(false)

const initWindowPos = (event) => {
  point.value = { x: event.x, y: event.y }
  fix.value = { x: left.value, y: top.value }
  click.value = true
  console.log(point.value)
}

const controlWindowPos = (event) => {
  top.value = fix.value.y + (event.y - point.value.y)
  left.value = fix.value.x + (event.x - point.value.x)
}

const controlWindowSize = async (event) => {
  width.value = event.x - left.value + 10
  height.value = event.y - top.value + 10

  await nextTick()
  // calcColumnCount()
}

window.addEventListener('mousemove', (event) => {
  if (click.value && cursor.value === 'grab')
    controlWindowPos(event)

  if (ctrl.value && cursor.value === 'move')
    controlWindowSize(event)
})

window.addEventListener('mouseup', () => {
  ctrl.value = false
  click.value = false
})

</script>