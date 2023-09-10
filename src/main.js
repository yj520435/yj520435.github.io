import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { Octokit } from 'octokit'

// const octokit = new Octokit({
//   // auth: process.env.VUE_APP_ACCESS_TOKEN
// })

// const repo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
//   owner: 'yj520435',
//   repo: 'yj520435.github.io',
//   path: 'posts/2023.json',
//   headers: {
//     'X-GitHub-Api-Version': '2022-11-28'
//   }
// })

const axios = require('axios')

console.log(process.env)

const get = async () => {
  const url = `8700087200248395088/posts/7616039949235559118?key=${process.env.VUE_APP_API_KEY}`;

  axios.get(url).then(res => {
    console.log(res.data)
  })
}

await get()

// const posts = JSON.parse(atob(repo.data.content))

// console.log(repo)

const posts = null

console.log(posts)

createApp(App).use(router).provide('posts', posts).mount('#app')