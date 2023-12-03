<template>
  <nav>
    <h3>29</h3>
    <div class="tags">
      <ul>
        <li
          v-for="tag of Object.keys(tags)"
          :key="tag"
          :class="{ selected: target.tag === tag }"
          @click="target.tag = tag"
        >
          {{ tags[tag] }}
        </li>
      </ul>
    </div>
  </nav>
  <div id="wrapper">
    <section id="day-section">
      <main class="pixel-box">
        <div class="articles">
          <article v-for="post of posts.filter((v) => v.tag === 'day')" :key="post.id">
            <figure
              v-if="post.figure"
              :class="post.figure ? `f-${post.figure.length}` : ''"
            >
              <img
                v-for="image of post.figure"
                :key="image"
                :src="`https://drive.google.com/uc?id=${image}`"
                alt="image"
              />
            </figure>
            <div v-html="get(post).html"></div>
          </article>
        </div>
      </main>
      <aside>
        <div class="years pixel-box">
          <div>
            <span>◀</span>
            <span>2023</span>
            <span>▶</span>
          </div>
        </div>
        <div class="list pixel-box">
          <ul>
            <li
              v-for="(post, i) of posts.filter((v) => v.tag === 'day')"
              :key="post.id"
              @click="focus(post, i)"
            >
              {{ date(post.id) }}
            </li>
          </ul>
        </div>
        <!-- <div class="posts">
          <div class="list">
            <article
              v-for="(post, i) of posts.filter((v) => v.tag === 'day')"
              :key="i"
              @click="focus(post, i)"
              :class="{ selected: target.post.day.id === post.id }"
            >
              {{ date(post.id) }}
            </article>
          </div>
        </div> -->
      </aside>
    </section>
    <section id="book-section">
      <main>
        <div
          v-for="post of posts.filter((v) => v.tag === 'book')"
          :key="post.id"
          class="book pixel-box"
          @click="target.post.book = post"
        >
          <img :src="`https://drive.google.com/uc?id=${post.figure}`" alt="" />
        </div>
        <article v-if="target.post.book">
          <button @click="target.post.book = null">닫기</button>
          <div v-html="get(target.post.book).html"></div>
        </article>
      </main>
    </section>
    <section id="zukebox-section">
      <main>
        <ul class="list">
          <li
            v-for="post of posts.filter((v) => v.tag === 'zukebox')"
            :key="post.id"
            class="pixel-box"
            @click="
              target.post.zukebox = post;
              post.active = !post.active;
            "
          >
            <div class="info">
              <img :src="post.figure" alt="" />
              <ul>
                <li>{{ post.title }}</li>
                <li>
                  {{ post.artist }} | {{ post.album }} ({{
                    moment(post.release, 'YYYY-MM-DD').format('MMM YYYY')
                  }})
                </li>
                <li>
                  <span v-for="jenre of post.jenre" :key="jenre">{{ jenre }}</span>
                </li>
              </ul>
            </div>
            <div class="video" :class="post.active ? 'show' : 'hide'">
              <iframe
                :src="`https://www.youtube.com/embed/${post.video}`"
                :title="post.title"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </li>
        </ul>
      </main>
      <!-- <main class="top">
        <ul>
          <li v-for="item of zukeboxItems" :key="item" class="pixel-box">
            <img :src="Object.keys(item).length > 0 ? item.figure : ''" alt="" />
          </li>
        </ul>
      </main>
      <main class="bottom"></main> -->
      <!-- <aside class="pixel-box">어사이드~</aside>
      <main>
        <div class="thumbnail pixel-box">
          <iframe
            src="https://www.youtube.com/embed/HQPrprfg_FA?si=ImHhPteE6oUpSP_d"
            title="SZA - Far"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="list pixel-box">목록...</div>
      </main> -->
      <!-- <main class="pixel-box">
        <iframe
          src="https://www.youtube.com/embed/HQPrprfg_FA?si=Z8aVuzQRGU7Tij-L"
          title="SZA - Far"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </main>
      <aside>
        <div class="pixel-box
        ">LEFT</div>
        <div class="pixel-box">RIGHT</div>
      </aside> -->
    </section>
    <section id="admin-section">
      <main>
        <div id="api-key-box">
          <div class="flex-row">
            <input type="text" v-model="authKey" placeholder="인증키 입력" />
            <button @click="write">확인</button>
          </div>
          <div class="auth-result" :class="{ success: authResult }">
            {{ authResult }}
          </div>
        </div>
      </main>
      <!-- <aside>
        <div>
          <ul class="list">
            <li class="pixel-box">1111</li>
            <li>2222</li>
          </ul>
        </div>
      </aside> -->
    </section>
  </div>
  <section v-if="writeOn"></section>
</template>

<script setup>
import { ref, watch } from 'vue';
import moment from 'moment';
import { Octokit } from 'octokit';

// const auth = ref(false);
const authKey = ref('');
const authResult = ref('');

const posts = ref([]);

const tags = ref({
  day: '오늘',
  book: '서재',
  zukebox: '주크박스',
  admin: '글관리',
});
// const years = ref(['2023', '2022', '2021', '2020', '2019']);

const target = ref({
  year: 2023,
  tag: 'day',
  post: {
    day: null,
    book: null,
    zukebox: null,
  },
});

const writeOn = ref(false);

function load() {
  import(`../posts/${target.value.year}.json`).then((result) => {
    posts.value = result.default;
    target.value.post.day = posts.value.filter((v) => v.tag === 'day')[0];

    posts.value.filter((v) => v.tag === 'zukebox').map((v) => (v.active = false));
  });
}

load();

watch(
  () => target.value.tag,
  (n, o) => {
    console.log(n, o);
    const wrapper = document.getElementById('wrapper');
    const wrapperHeight = window.innerHeight - 200 - 91;
    wrapper.scrollTo(0, wrapperHeight * Object.keys(tags.value).indexOf(n));
  }
);

function date(id) {
  const text = moment(id, 'YYYYMMDDhh').format('M월 D일');
  const time = +moment(id, 'YYYYMMDDhh').format('hh');
  const timeText = time >= 12 ? '오후' : '오전';
  return `${text} ${timeText} ${time}시`;
}

function focus(post, index) {
  target.value.post.day = post;
  let height = document.getElementsByClassName('articles')[0].children[0].offsetHeight;
  // for (let i = 0; i < index; i++) {
  //   console.log(document.getElementsByClassName('articles')[0].children);
  //   height += document.getElementsByClassName('articles')[0].children[i].offsetHeight;
  //   console.log(height);
  // }
  document.getElementsByClassName('articles')[0].scrollTo(0, (height + 10) * index);
  console.log(index);
}

function get(post) {
  // let text = `<p class="date">${moment(post.id, 'YYYYMMDDhh').format('MMM DD YYYY')}</p>`;
  // let text = '';

  // if (Object.keys(post).length > 0) {
  //   for (const line of post.contents) text += line;
  //   let parser = new DOMParser();
  //   let doc = parser.parseFromString(text, 'text/html');

  //   // images
  //   let hasFigure = text.includes('<figure>');
  //   if (hasFigure) {
  //     let figure = doc.getElementsByTagName('figure')[0];
  //     let images = doc.getElementsByTagName('img');
  //     for (let image of images) image.src = `https://drive.google.com/uc?id=${image.alt}`;
  //     figure.classList.add(`f-${images.length}`);
  //   }

  //   return { html: doc.body.innerHTML, figure: hasFigure };
  // }

  // return { html: '', figure: false };

  let html = '';

  if (post.tag === 'day') {
    for (const line of post.contents) html += line;
  } else if (post.tag === 'book') {
    html += `<h3>${post.title}</h3>${post.author}<br><br>`;

    for (const line of post.contents) html += line;
  }
  return { html };
}

// eslint-disable-next-line no-unused-vars
async function write() {
  const octokit = new Octokit({
    auth: authKey.value,
  });
  console.log(authKey.value);
  const call = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'yj520435',
    repo: 'yj520435.github.io',
    path: 'LOG.md',
    message: 'add log',
    committer: {
      name: 'yujin',
      email: 'yj520435@gmail.com',
    },
    content: 'bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnRz',
    sha: 'febf3fc76bea57db07d8d6b981d4de019f7c2fe1',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  console.log(call);
}

// window.addEventListener('resize', calcColumnCount);

// const yearFlag = ref(false);

// function dropdown() {
//   const target = document.getElementById(`year-list-box`);
//   // OPEN
//   if (yearFlag.value) {
//     target.classList.remove('slide-up');
//     target.classList.add('slide-down');
//     target.style.borderBottom = '2px solid black';
//   }
//   // CLOSE
//   else {
//     target.classList.remove('slide-down');
//     target.classList.add('slide-up');

//     setTimeout(() => {
//       target.style.borderBottom = 'none';
//     }, 500);
//   }
// }
</script>
