<script setup lang="ts">
import { onMounted } from 'vue'
import { useIPFSStore } from '@/stores/ipfs'
import { useGalleryStore } from '@/stores/gallery'

const ipfsStore = useIPFSStore()
const galleryStore = useGalleryStore()

onMounted(async () => {
  if (!ipfsStore.isInitialized) {
    await ipfsStore.initialize()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Bilderbrett.app
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Decentralized Image Gallery with IPFS and OrbitDB
        </p>
      </header>

      <!-- IPFS Status -->
      <div class="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          IPFS Node Status
        </h2>
        
        <div v-if="ipfsStore.isInitializing" class="flex items-center text-blue-600">
          <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Initializing IPFS node...</span>
        </div>

        <div v-else-if="ipfsStore.isReady" class="space-y-2">
          <div class="flex items-center text-green-600">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">Connected</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Peer ID: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{{ ipfsStore.peerId }}</code>
          </p>
        </div>

        <div v-else-if="ipfsStore.error" class="text-red-600">
          <p class="font-semibold">Error: {{ ipfsStore.error }}</p>
          <button
            @click="ipfsStore.initialize()"
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>

        <div v-else class="text-gray-600">
          <button
            @click="ipfsStore.initialize()"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Initialize IPFS
          </button>
        </div>
      </div>

      <!-- Galleries Overview -->
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Galleries
          </h2>
          <router-link
            to="/galleries/new"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create Gallery
          </router-link>
        </div>

        <div v-if="galleryStore.galleries.length === 0" class="text-center py-12 text-gray-500">
          <p class="text-lg mb-2">No galleries yet</p>
          <p class="text-sm">Create your first gallery to get started</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="gallery in galleryStore.galleries"
            :key="gallery.id"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition cursor-pointer"
            @click="$router.push(`/galleries/${gallery.id}`)"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ gallery.name }}
            </h3>
            <p v-if="gallery.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ gallery.description }}
            </p>
            <div class="flex items-center text-sm text-gray-500">
              <span>{{ gallery.items.length }} items</span>
              <span v-if="gallery.isPrivate" class="ml-2 text-yellow-600">🔒 Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
