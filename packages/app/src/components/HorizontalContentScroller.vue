<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { GalleryItem } from '@/stores/gallery'

interface Props {
  items: GalleryItem[]
  currentIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0
})

const emit = defineEmits<{
  (e: 'update:currentIndex', value: number): void
  (e: 'item-click', item: GalleryItem, index: number): void
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const currentItemIndex = ref(props.currentIndex)
const touchStartX = ref(0)
const isDragging = ref(false)

const scrollToIndex = (index: number) => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const itemWidth = container.clientWidth
  container.scrollTo({
    left: index * itemWidth,
    behavior: 'smooth'
  })
  currentItemIndex.value = index
  emit('update:currentIndex', index)
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches[0]) {
    touchStartX.value = e.touches[0].clientX
    isDragging.value = true
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value || !e.changedTouches[0]) return
  
  const touchEndX = e.changedTouches[0].clientX
  const diff = touchStartX.value - touchEndX
  
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentItemIndex.value < props.items.length - 1) {
      scrollToIndex(currentItemIndex.value + 1)
    } else if (diff < 0 && currentItemIndex.value > 0) {
      scrollToIndex(currentItemIndex.value - 1)
    }
  }
  
  isDragging.value = false
}

const handleScroll = () => {
  if (!scrollContainer.value || isDragging.value) return
  
  const container = scrollContainer.value
  const index = Math.round(container.scrollLeft / container.clientWidth)
  
  if (index !== currentItemIndex.value) {
    currentItemIndex.value = index
    emit('update:currentIndex', index)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft' && currentItemIndex.value > 0) {
    e.preventDefault()
    scrollToIndex(currentItemIndex.value - 1)
  } else if (e.key === 'ArrowRight' && currentItemIndex.value < props.items.length - 1) {
    e.preventDefault()
    scrollToIndex(currentItemIndex.value + 1)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  scrollToIndex(props.currentIndex)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const handleItemClick = (item: GalleryItem, index: number) => {
  emit('item-click', item, index)
}
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      class="horizontal-scroll w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex"
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex-shrink-0 w-full h-full snap-center snap-always flex items-center justify-center bg-background"
        @click="handleItemClick(item, index)"
      >
        <div class="w-full h-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center">
          <!-- Image/Content Placeholder -->
          <div class="w-full max-h-[70vh] bg-surface rounded-lg overflow-hidden flex items-center justify-center mb-4">
            <div class="w-full aspect-square max-h-[70vh] flex items-center justify-center">
              <svg class="w-24 h-24 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Content Info -->
          <div class="w-full text-center space-y-2">
            <h2 class="text-xl font-semibold text-foreground">{{ item.title }}</h2>
            <p v-if="item.description" class="text-sm text-foreground-muted">{{ item.description }}</p>
            <div class="flex items-center justify-center gap-4 text-xs text-foreground-muted">
              <span>CID: {{ item.cid.slice(0, 12) }}...</span>
              <span v-if="item.encrypted" class="text-accent">🔒 Encrypted</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="items.length === 0" class="flex-shrink-0 w-full h-full snap-center flex items-center justify-center">
        <div class="text-center">
          <svg class="w-24 h-24 mx-auto mb-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-lg text-foreground-muted">No content yet</p>
          <p class="text-sm text-foreground-muted mt-2">Upload your first image to get started</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation Arrows (Desktop) -->
    <button
      v-if="currentItemIndex > 0 && items.length > 0"
      @click="scrollToIndex(currentItemIndex - 1)"
      class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-surface/80 backdrop-blur text-foreground hover:bg-surface-hover transition-colors"
      aria-label="Previous"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    
    <button
      v-if="currentItemIndex < items.length - 1 && items.length > 0"
      @click="scrollToIndex(currentItemIndex + 1)"
      class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-surface/80 backdrop-blur text-foreground hover:bg-surface-hover transition-colors"
      aria-label="Next"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
    
    <!-- Progress Indicator -->
    <div v-if="items.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        @click="scrollToIndex(index)"
        :class="[
          'w-2 h-2 rounded-full transition-all',
          index === currentItemIndex
            ? 'bg-accent w-8'
            : 'bg-surface-hover hover:bg-foreground-muted'
        ]"
        :aria-label="`Go to item ${index + 1}`"
      />
    </div>
  </div>
</template>
