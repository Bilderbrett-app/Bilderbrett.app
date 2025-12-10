import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateGalleryView from '@/views/CreateGalleryView.vue'
import GalleryView from '@/views/GalleryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/galleries/new',
      name: 'create-gallery',
      component: CreateGalleryView,
    },
    {
      path: '/galleries/:id',
      name: 'gallery',
      component: GalleryView,
    },
  ],
})

export default router
