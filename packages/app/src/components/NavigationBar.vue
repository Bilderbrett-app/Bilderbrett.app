<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const showSearch = ref(false)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
    showSearch.value = false
  }
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
    <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span class="hidden sm:inline">Bilderbrett</span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <router-link
          to="/"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive('/') && !isActive('/search') && !isActive('/upload') && !isActive('/profile')
              ? 'bg-accent text-white'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
          ]"
        >
          Feed
        </router-link>
        <router-link
          to="/upload"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive('/upload')
              ? 'bg-accent text-white'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
          ]"
        >
          Upload
        </router-link>
        <router-link
          to="/profile"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive('/profile')
              ? 'bg-accent text-white'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
          ]"
        >
          Profile
        </router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <button
            v-if="!showSearch"
            @click="toggleSearch"
            class="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            title="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          
          <div v-else class="flex items-center gap-2">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              @keyup.escape="toggleSearch"
              type="text"
              placeholder="Search..."
              class="w-48 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              autofocus
            />
            <button
              @click="handleSearch"
              class="p-2 rounded-lg text-accent hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button
              @click="toggleSearch"
              class="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          @click="router.push('/menu')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div class="flex items-center justify-around h-14">
        <router-link
          to="/"
          :class="[
            'flex flex-col items-center justify-center flex-1 h-full',
            isActive('/') && !isActive('/upload') && !isActive('/profile')
              ? 'text-accent'
              : 'text-foreground-muted'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span class="text-xs mt-1">Feed</span>
        </router-link>
        
        <router-link
          to="/upload"
          :class="[
            'flex flex-col items-center justify-center flex-1 h-full',
            isActive('/upload') ? 'text-accent' : 'text-foreground-muted'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span class="text-xs mt-1">Upload</span>
        </router-link>
        
        <router-link
          to="/profile"
          :class="[
            'flex flex-col items-center justify-center flex-1 h-full',
            isActive('/profile') ? 'text-accent' : 'text-foreground-muted'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span class="text-xs mt-1">Profile</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
