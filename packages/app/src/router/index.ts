import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '@/views/FeedView.vue'
import UploadView from '@/views/UploadView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateGalleryView from '@/views/CreateGalleryView.vue'
import GalleryView from '@/views/GalleryView.vue'
import SearchView from '@/views/SearchView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'feed',
      component: FeedView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
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
