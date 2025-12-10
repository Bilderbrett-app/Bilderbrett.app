<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'
import { useIPFSStore } from '@/stores/ipfs'

const router = useRouter()
const galleryStore = useGalleryStore()
const ipfsStore = useIPFSStore()

const title = ref('')
const description = ref('')
const selectedGallery = ref('')
const file = ref<File | null>(null)
const filePreview = ref<string | null>(null)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const isPrivate = ref(false)
const tags = ref<string[]>([])
const tagInput = ref('')

const fileInput = ref<HTMLInputElement | null>(null)

const hasGalleries = computed(() => galleryStore.galleries.length > 0)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0 && files[0]) {
    file.value = files[0]
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  
  if (files && files.length > 0 && files[0]) {
    file.value = files[0]
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(files[0])
  }
}

const removeFile = () => {
  file.value = null
  filePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const handleSubmit = async () => {
  if (!file.value || !title.value.trim()) {
    uploadError.value = 'Please provide a title and select a file'
    return
  }
  
  if (!hasGalleries.value && !selectedGallery.value) {
    uploadError.value = 'Please create a gallery first'
    return
  }
  
  if (!ipfsStore.isReady) {
    uploadError.value = 'IPFS is not ready. Please wait...'
    return
  }
  
  isUploading.value = true
  uploadError.value = null
  
  try {
    // TODO: Upload file to IPFS
    // const cid = await ipfsStore.addFile(file.value)
    
    // Mock CID for now
    const mockCid = `bafybeig${Math.random().toString(36).substring(2, 15)}`
    
    // Add to gallery
    const galleryId = selectedGallery.value || galleryStore.galleries[0]?.id
    if (!galleryId) {
      uploadError.value = 'No gallery selected'
      return
    }
    
    galleryStore.addItemToGallery(
      galleryId,
      mockCid,
      title.value.trim(),
      description.value.trim() || undefined,
      isPrivate.value
    )
    
    // Navigate to gallery
    router.push(`/galleries/${galleryId}`)
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    isUploading.value = false
  }
}

const handleCreateGallery = () => {
  router.push('/galleries/new')
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-3.5rem)] overflow-y-auto">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Upload Content</h1>
        <p class="text-foreground-muted">Share your images, videos, audio, or markdown content</p>
      </header>

      <!-- No Galleries Warning -->
      <div v-if="!hasGalleries" class="mb-8 p-6 bg-surface border border-accent rounded-lg">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground mb-2">No Galleries Yet</h3>
            <p class="text-foreground-muted mb-4">You need to create a gallery before you can upload content.</p>
            <button
              @click="handleCreateGallery"
              class="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Create Your First Gallery
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Form -->
      <div v-else class="bg-surface rounded-xl border border-border overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- File Upload Area -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">File *</label>
            
            <div v-if="!file" 
              @drop="handleDrop"
              @dragover.prevent
              class="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer"
              @click="fileInput?.click()"
            >
              <svg class="w-16 h-16 mx-auto mb-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p class="text-foreground mb-2">Drag & drop your file here</p>
              <p class="text-sm text-foreground-muted mb-4">or</p>
              <button type="button" class="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors">
                Browse Files
              </button>
              <p class="text-xs text-foreground-muted mt-4">Supported: Images, Videos, Audio, Markdown</p>
            </div>
            
            <!-- File Preview -->
            <div v-else class="relative border border-border rounded-lg overflow-hidden">
              <img v-if="filePreview" :src="filePreview" alt="Preview" class="w-full h-64 object-cover" />
              <div class="absolute top-2 right-2">
                <button
                  type="button"
                  @click="removeFile"
                  class="p-2 bg-surface/90 backdrop-blur rounded-lg text-foreground-muted hover:text-accent transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div class="p-4 bg-background">
                <p class="text-sm text-foreground font-medium">{{ file.name }}</p>
                <p class="text-xs text-foreground-muted">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
            </div>
            
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              accept="image/*,video/*,audio/*,.md,.markdown"
              class="hidden"
            />
          </div>

          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input
              id="title"
              v-model="title"
              type="text"
              required
              class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Give your content a title"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              id="description"
              v-model="description"
              rows="4"
              class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Describe your content (optional)"
            ></textarea>
          </div>

          <!-- Gallery Selection -->
          <div>
            <label for="gallery" class="block text-sm font-medium text-foreground mb-2">Gallery *</label>
            <select
              id="gallery"
              v-model="selectedGallery"
              required
              class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="" disabled>Select a gallery</option>
              <option v-for="gallery in galleryStore.galleries" :key="gallery.id" :value="gallery.id">
                {{ gallery.name }}
              </option>
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-foreground mb-2">Tags</label>
            <div class="flex gap-2 mb-2">
              <input
                id="tags"
                v-model="tagInput"
                @keyup.enter="addTag"
                type="text"
                class="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Add tags (press Enter)"
              />
              <button
                type="button"
                @click="addTag"
                class="px-4 py-2 bg-surface border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors"
              >
                Add
              </button>
            </div>
            <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="tag in tags"
                :key="tag"
                class="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="hover:text-accent-hover transition-colors"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            </div>
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
              Make this content private (encrypted)
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="p-4 bg-accent/10 border border-accent rounded-lg text-accent">
            {{ uploadError }}
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isUploading || !file || !title"
              class="flex-1 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!isUploading">Upload</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            </button>
            <button
              type="button"
              @click="router.back()"
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
