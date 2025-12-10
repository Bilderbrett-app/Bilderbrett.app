<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'
import ContentCard from '@/components/ContentCard.vue'
import type { GalleryItem } from '@/stores/gallery'

const route = useRoute()
const router = useRouter()
const galleryStore = useGalleryStore()

const searchQuery = ref((route.query.q as string) || '')
const activeFilter = ref<'all' | 'images' | 'videos' | 'audio' | 'markdown'>('all')
const sortBy = ref<'recent' | 'title'>('recent')

// Get all items from all galleries
const allItems = computed<GalleryItem[]>(() => {
  const items: GalleryItem[] = []
  galleryStore.galleries.forEach(gallery => {
    items.push(...gallery.items)
  })
  return items
})

// Filter and search items
const filteredItems = computed(() => {
  let items = allItems.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }

  // Apply type filter (currently just mocked)
  // In real implementation, check file type from metadata

  // Sort items
  if (sortBy.value === 'recent') {
    items.sort((a, b) => b.timestamp - a.timestamp)
  } else {
    items.sort((a, b) => a.title.localeCompare(b.title))
  }

  return items
})

watch(() => route.query.q, (newQuery) => {
  searchQuery.value = (newQuery as string) || ''
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ query: { q: searchQuery.value.trim() } })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  router.push({ query: {} })
}

const handleItemClick = (item: GalleryItem) => {
  console.log('Item clicked:', item)
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-3.5rem)] overflow-y-auto">
    <div class="max-w-screen-2xl mx-auto px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-4">Search</h1>
        
        <!-- Search Bar -->
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search content by title or description..."
            class="w-full px-4 py-3 pl-12 pr-12 bg-surface border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-wrap items-center gap-4">
        <!-- Type Filter -->
        <div class="flex gap-2">
          <button
            v-for="filter in ['all', 'images', 'videos', 'audio', 'markdown']"
            :key="filter"
            @click="activeFilter = filter as any"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeFilter === filter
                ? 'bg-accent text-white'
                : 'bg-surface text-foreground-muted hover:text-foreground hover:bg-surface-hover'
            ]"
          >
            {{ filter }}
          </button>
        </div>

        <!-- Sort -->
        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm text-foreground-muted">Sort by:</span>
          <select
            v-model="sortBy"
            class="px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="recent">Most Recent</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <!-- Results Count -->
      <div v-if="searchQuery" class="mb-6">
        <p class="text-foreground-muted">
          Found <span class="font-semibold text-foreground">{{ filteredItems.length }}</span> 
          {{ filteredItems.length === 1 ? 'result' : 'results' }} for 
          "<span class="text-foreground">{{ searchQuery }}</span>"
        </p>
      </div>

      <!-- Results Grid -->
      <div v-if="filteredItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ContentCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :compact="true"
          @click="handleItemClick(item)"
        />
      </div>

      <!-- Empty States -->
      <div v-else-if="searchQuery" class="flex flex-col items-center justify-center py-16">
        <svg class="w-24 h-24 text-foreground-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h2 class="text-2xl font-semibold text-foreground mb-2">No results found</h2>
        <p class="text-foreground-muted mb-4">Try adjusting your search or filters</p>
        <button
          @click="clearSearch"
          class="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Clear Search
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16">
        <svg class="w-24 h-24 text-foreground-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h2 class="text-2xl font-semibold text-foreground mb-2">Start searching</h2>
        <p class="text-foreground-muted">Enter a search term to find content</p>
      </div>
    </div>
  </div>
</template>
