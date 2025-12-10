<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'
import HorizontalContentScroller from '@/components/HorizontalContentScroller.vue'
import ContentCard from '@/components/ContentCard.vue'

const route = useRoute()
const router = useRouter()
const galleryStore = useGalleryStore()

const galleryId = computed(() => route.params.id as string)
const gallery = computed(() => 
  galleryStore.galleries.find(g => g.id === galleryId.value)
)

const currentIndex = ref(0)
const showGrid = ref(false)

onMounted(() => {
  if (!gallery.value) {
    router.push('/')
  }
})

function handleBack() {
  router.push('/profile')
}

function handleUpload() {
  router.push('/upload')
}

function handleDeleteGallery() {
  if (confirm(`Are you sure you want to delete "${gallery.value?.name}"?`)) {
    galleryStore.deleteGallery(galleryId.value)
    router.push('/profile')
  }
}

const toggleView = () => {
  showGrid.value = !showGrid.value
}

const handleItemClick = (item: any, index: number) => {
  console.log('Item clicked:', item, index)
}
</script>

<template>
  <div v-if="gallery" class="w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-3.5rem)]">
    <!-- Header -->
    <div class="bg-surface border-b border-border px-4 py-4">
      <div class="max-w-screen-2xl mx-auto flex items-center justify-between">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="hidden sm:inline">Back</span>
        </button>

        <div class="flex-1 mx-4 max-w-xl">
          <div class="flex items-center gap-2">
            <h1 class="text-lg sm:text-xl font-bold text-foreground truncate">
              {{ gallery.name }}
            </h1>
            <span v-if="gallery.isPrivate" class="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded">
              🔒
            </span>
          </div>
          <p class="text-sm text-foreground-muted">
            {{ gallery.items.length }} items
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleView"
            class="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            :title="showGrid ? 'Switch to horizontal view' : 'Switch to grid view'"
          >
            <svg v-if="!showGrid" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <button
            @click="handleUpload"
            class="hidden sm:flex px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            Upload
          </button>
          
          <button
            @click="handleDeleteGallery"
            class="p-2 rounded-lg text-foreground-muted hover:text-accent transition-colors"
            title="Delete gallery"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="w-full h-[calc(100vh-13rem)] md:h-[calc(100vh-8.5rem)]">
      <!-- Horizontal View -->
      <div v-if="!showGrid" class="w-full h-full">
        <div v-if="gallery.items.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg class="w-24 h-24 mx-auto mb-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg text-foreground-muted mb-2">No content yet</p>
            <p class="text-sm text-foreground-muted mb-4">Upload your first image to get started</p>
            <button
              @click="handleUpload"
              class="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Upload Image
            </button>
          </div>
        </div>
        
        <HorizontalContentScroller
          v-else
          :items="gallery.items"
          v-model:current-index="currentIndex"
          @item-click="handleItemClick"
        />
      </div>

      <!-- Grid View -->
      <div v-else class="w-full h-full overflow-y-auto">
        <div class="max-w-screen-2xl mx-auto px-4 py-6">
          <div v-if="gallery.items.length === 0" class="flex flex-col items-center justify-center min-h-[50vh]">
            <svg class="w-24 h-24 text-foreground-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg text-foreground-muted mb-2">No content yet</p>
            <p class="text-sm text-foreground-muted mb-4">Upload your first image to get started</p>
            <button
              @click="handleUpload"
              class="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Upload Image
            </button>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ContentCard
              v-for="item in gallery.items"
              :key="item.id"
              :item="item"
              :compact="true"
              @click="handleItemClick(item, gallery.items.indexOf(item))"
            />
          </div>
        </div>
      </div>

      <!-- Current Item Counter (Horizontal View) -->
      <div v-if="!showGrid && gallery.items.length > 0" class="absolute bottom-20 md:bottom-6 left-4 z-10">
        <div class="px-3 py-1.5 bg-surface/80 backdrop-blur rounded-lg text-sm text-foreground-muted">
          {{ currentIndex + 1 }} / {{ gallery.items.length }}
        </div>
      </div>
    </div>
  </div>
</template>
