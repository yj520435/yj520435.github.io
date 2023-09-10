import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Octokit } from 'octokit'

const octokit = new Octokit({})
const repo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
  owner: 'yj520435',
  repo: 'yj520435.github.io',
  path: 'posts/2023.json',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})
const posts = JSON.parse(atob(repo.data.content))

createApp(App).use(router).provide('posts', posts).mount('#app')