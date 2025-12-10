<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'

const router = useRouter()
const galleryStore = useGalleryStore()

const name = ref('')
const description = ref('')
const isPrivate = ref(false)
const error = ref<string | null>(null)

function handleSubmit() {
  if (!name.value.trim()) {
    error.value = 'Gallery name is required'
    return
  }

  try {
    const gallery = galleryStore.createGallery(
      name.value.trim(),
      description.value.trim() || undefined,
      isPrivate.value
    )
    
    router.push(`/galleries/${gallery.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create gallery'
  }
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Gallery
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Create a new gallery to organize and share your images
          </p>
        </header>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Gallery Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gallery Name *
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="My Gallery"
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                v-model="description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="A brief description of your gallery..."
              ></textarea>
            </div>

            <!-- Privacy -->
            <div class="flex items-center">
              <input
                id="isPrivate"
                v-model="isPrivate"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="isPrivate" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Make this gallery private (encrypted)
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                Create Gallery
              </button>
              <button
                type="button"
                @click="handleCancel"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
