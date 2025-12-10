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
  <div class="w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-3.5rem)] overflow-y-auto">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">
          Create New Gallery
        </h1>
        <p class="text-foreground-muted">
          Create a new gallery to organize and share your images
        </p>
      </header>

      <div class="bg-surface rounded-xl border border-border p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Gallery Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-foreground mb-2">
              Gallery Name *
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="My Gallery"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-foreground mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              v-model="description"
              rows="4"
              class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="A brief description of your gallery..."
            ></textarea>
          </div>

          <!-- Privacy -->
          <div class="flex items-center">
            <input
              id="isPrivate"
              v-model="isPrivate"
              type="checkbox"
              class="w-4 h-4 text-accent border-border rounded focus:ring-accent"
            />
            <label for="isPrivate" class="ml-2 text-sm text-foreground">
              Make this gallery private (encrypted)
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-accent/10 border border-accent rounded-lg text-accent">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Create Gallery
            </button>
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-3 bg-surface border border-border text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
