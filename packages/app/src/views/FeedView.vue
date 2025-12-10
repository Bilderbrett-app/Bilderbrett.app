<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import HorizontalContentScroller from '@/components/HorizontalContentScroller.vue'
import ContentCard from '@/components/ContentCard.vue'
import type { GalleryItem } from '@/stores/gallery'

const galleryStore = useGalleryStore()

// Get all items from all galleries for the feed
const allItems = computed<GalleryItem[]>(() => {
  const items: GalleryItem[] = []
  galleryStore.galleries.forEach(gallery => {
    items.push(...gallery.items)
  })
  // Sort by timestamp, newest first
  return items.sort((a, b) => b.timestamp - a.timestamp)
})

const currentIndex = ref(0)
const showGrid = ref(false)

const handleItemClick = (item: GalleryItem, index: number) => {
  console.log('Item clicked:', item, index)
  // Could navigate to detail view or open modal
}

const toggleView = () => {
  showGrid.value = !showGrid.value
}
</script>

<template>
  <div class="w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-3.5rem)]">
    <!-- View Toggle (Top Right) -->
    <div class="absolute top-16 right-4 z-10">
      <button
        @click="toggleView"
        class="p-2 rounded-lg bg-surface/80 backdrop-blur text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        :title="showGrid ? 'Switch to horizontal view' : 'Switch to grid view'"
      >
        <svg v-if="!showGrid" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Horizontal Scrolling View -->
    <div v-if="!showGrid" class="w-full h-full">
      <HorizontalContentScroller
        :items="allItems"
        v-model:current-index="currentIndex"
        @item-click="handleItemClick"
      />
    </div>

    <!-- Grid View -->
    <div v-else class="w-full h-full overflow-y-auto">
      <div class="max-w-screen-2xl mx-auto px-4 py-6">
        <!-- Empty State -->
        <div v-if="allItems.length === 0" class="flex flex-col items-center justify-center min-h-[50vh]">
          <svg class="w-24 h-24 text-foreground-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h2 class="text-2xl font-semibold text-foreground mb-2">No content yet</h2>
          <p class="text-foreground-muted mb-4">Start by creating a gallery and uploading content</p>
          <router-link
            to="/galleries/new"
            class="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            Create Gallery
          </router-link>
        </div>

        <!-- Grid of Content Cards -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ContentCard
            v-for="item in allItems"
            :key="item.id"
            :item="item"
            :compact="true"
            @click="handleItemClick(item, allItems.indexOf(item))"
          />
        </div>
      </div>
    </div>

    <!-- Current Item Counter -->
    <div v-if="!showGrid && allItems.length > 0" class="absolute top-16 left-4 z-10">
      <div class="px-3 py-1.5 bg-surface/80 backdrop-blur rounded-lg text-sm text-foreground-muted">
        {{ currentIndex + 1 }} / {{ allItems.length }}
      </div>
    </div>
  </div>
</template>
