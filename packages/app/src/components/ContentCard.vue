<script setup lang="ts">
import type { GalleryItem } from '@/stores/gallery'

interface Props {
  item: GalleryItem
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}
</script>

<template>
  <div
    @click="emit('click')"
    :class="[
      'group cursor-pointer overflow-hidden transition-all',
      compact
        ? 'rounded-lg bg-surface hover:bg-surface-hover'
        : 'rounded-xl bg-surface hover:shadow-lg hover:shadow-accent/20'
    ]"
  >
    <!-- Image/Content -->
    <div :class="['relative overflow-hidden bg-background', compact ? 'aspect-square' : 'aspect-video']">
      <!-- Placeholder for actual image -->
      <div class="w-full h-full flex items-center justify-center">
        <svg class="w-16 h-16 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      
      <!-- Encrypted Badge -->
      <div
        v-if="item.encrypted"
        class="absolute top-2 right-2 px-2 py-1 bg-accent/90 backdrop-blur text-white text-xs font-medium rounded-full flex items-center gap-1"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        Private
      </div>
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <svg class="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Content Info -->
    <div v-if="!compact" class="p-4 space-y-2">
      <h3 class="text-base font-semibold text-foreground line-clamp-2">{{ item.title }}</h3>
      <p v-if="item.description" class="text-sm text-foreground-muted line-clamp-2">{{ item.description }}</p>
      
      <div class="flex items-center justify-between pt-2">
        <span class="text-xs text-foreground-muted">{{ formatDate(item.timestamp) }}</span>
        <span class="text-xs text-foreground-muted font-mono">{{ item.cid.slice(0, 8) }}...</span>
      </div>
    </div>
    
    <!-- Compact Footer -->
    <div v-else class="p-2">
      <p class="text-sm font-medium text-foreground line-clamp-1">{{ item.title }}</p>
      <span class="text-xs text-foreground-muted">{{ formatDate(item.timestamp) }}</span>
    </div>
  </div>
</template>
