<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'

const route = useRoute()
const router = useRouter()
const galleryStore = useGalleryStore()

const galleryId = computed(() => route.params.id as string)
const gallery = computed(() => 
  galleryStore.galleries.find(g => g.id === galleryId.value)
)

onMounted(() => {
  if (!gallery.value) {
    router.push('/')
  }
})

function handleBack() {
  router.push('/')
}

function handleUpload() {
  // TODO: Implement file upload
  alert('File upload coming soon!')
}

function handleDeleteGallery() {
  if (confirm(`Are you sure you want to delete "${gallery.value?.name}"?`)) {
    galleryStore.deleteGallery(galleryId.value)
    router.push('/')
  }
}
</script>

<template>
  <div v-if="gallery" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="handleBack"
          class="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </button>

        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ gallery.name }}
              </h1>
              <span v-if="gallery.isPrivate" class="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                🔒 Private
              </span>
            </div>
            <p v-if="gallery.description" class="text-lg text-gray-600 dark:text-gray-300">
              {{ gallery.description }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Created {{ new Date(gallery.created).toLocaleDateString() }} • 
              {{ gallery.items.length }} items
            </p>
          </div>

          <div class="flex gap-2">
            <button
              @click="handleUpload"
              class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Upload Image
            </button>
            <button
              @click="handleDeleteGallery"
              class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Delete Gallery
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Items -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Images
        </h2>

        <div v-if="gallery.items.length === 0" class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-lg mb-2">No images yet</p>
          <p class="text-sm mb-4">Upload your first image to get started</p>
          <button
            @click="handleUpload"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Upload Image
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="item in gallery.items"
            :key="item.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
          >
            <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {{ item.title }}
            </h3>
            <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ item.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              CID: {{ item.cid.slice(0, 12) }}...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
