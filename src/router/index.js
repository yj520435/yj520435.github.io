import { createWebHistory, createRouter } from "vue-router";
import BasicLayout from '@/components/BasicLayout.vue'
import ArchiveLayout from '@/components/ArchiveLayout.vue'

const routes = [
  {
    path: "/:id",
    name: "Blog",
    component: BasicLayout
  },
  {
    path: "/archive",
    name: "Archive",
    component: ArchiveLayout
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router