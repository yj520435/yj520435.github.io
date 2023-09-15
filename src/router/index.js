import { createWebHistory, createRouter } from "vue-router";
import App from '@/App.vue'
import BasicLayout from '@/components/BasicLayout.vue'
import ArchiveLayout from '@/components/ArchiveLayout.vue'

const routes = [
  {
    path: "/",
    name: App,
  },
  {
    path: "/:year",
    name: "Blog",
    component: ArchiveLayout,
    children: [{
      path: ":day",
      component: BasicLayout
    }]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router