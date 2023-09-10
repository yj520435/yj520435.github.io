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

const get = async () => {
  const blogId = '8700087200248395088'
  const postId = '7616039949235559118'
  const apiKey = process.env.VUE_APP_API_KEY
  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`;
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