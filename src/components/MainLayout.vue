<template>
  <div id="blog-wrapper">
    <section
      class="archive"
      :class="{ mobile: isMobile }"
      v-for="columnIndex of columnCount"
      :key="columnIndex"
    >
      <div
        v-for="post of postArray(posts, columnIndex - 1)"
        :key="post.id"
        class="post"
        :class="{ mobile: isMobile }"
        v-html="getContents(post)"
      ></div>
    </section>
  </div>
  <div id="focus-wrapper" v-if="modalOn" :style="`top: ${windowHeight}px`">
    <nav v-for="item of [-2, -1, 0, 1, 2]" :key="item" :class="{ selected: item === 0 }">
      {{ years[selectedYearIndex + item] }}
    </nav>
  </div>
</template>

<script setup>
import { nextTick, ref, defineEmits } from "vue";
import moment from "moment";

const emit = defineEmits(["resize"]);

const columnCount = ref(0);
const isMobile = ref(false);
const windowHeight = ref(0);

const years = ref([2023, 2022, 2021, 2020, 2019, 2018]);
const selectedYearIndex = ref(0);

const posts = ref([]);
const modalOn = ref(false);

const calcColumnCount = async () => {
  const innerWidth = window.innerWidth;
  let count = Math.floor(innerWidth / 440);
  count = count === 0 ? 1 : count;
  columnCount.value = posts.value.length < count ? posts.value.length : count;

  await nextTick();
  isMobile.value = window.innerWidth < 510;
};

const postArray = (posts, columnIndex) => {
  let array = [];
  for (let [index, post] of posts.entries()) {
    if (index % columnCount.value === columnIndex) array.push(post);
  }
  return array;
};

const getContents = (post) => {
  let text = "";
  for (const line of post.contents) text += line;
  text += `<p class="date">${moment(post.id, "YYYYMMDDhh").format("YYYY-MM-DD")}</p>`;

  let parser = new DOMParser();
  let doc = parser.parseFromString(text, "text/html");

  // images
  let images = doc.getElementsByTagName("img");
  for (let image of images) image.src = `https://drive.google.com/uc?id=${image.alt}`;

  return doc.body.innerHTML;
};

const getImageLayout = async () => {
  const figures = document.getElementsByTagName("figure");
  await nextTick();
  for (const figure of figures) {
    if (figure.children.length % 2 === 0) figure.classList.add("flex-2");
  }
};

const selectedYear = years.value[selectedYearIndex.value];
import(/* @vite-ignore */ `../../posts/${selectedYear}.json`).then((result) => {
  posts.value = result.default;
  calcColumnCount();
  getImageLayout();
  resize();
});

const resize = () => {
  emit("resize", columnCount.value);
};

const showModal = () => {
  modalOn.value = !modalOn.value;
  windowHeight.value = window.innerHeight;
};

window.addEventListener("resize", () => {
  calcColumnCount();
  resize();

  if (windowHeight.value) windowHeight.value = window.innerHeight;
});

window.addEventListener("keydown", (event) => {
  console.log(event);
  if (event.key === "ArrowRight") selectedYearIndex.value += 1;

  if (event.key === "ArrowLeft") selectedYearIndex.value -= 1;

  if (event.key === "/") showModal();

  //if (event.key === 'Enter' && modalOn.value)
});
</script>
