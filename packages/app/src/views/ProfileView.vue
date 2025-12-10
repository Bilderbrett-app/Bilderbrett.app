<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import { useIPFSStore } from '@/stores/ipfs'
import ContentCard from '@/components/ContentCard.vue'

const galleryStore = useGalleryStore()
const ipfsStore = useIPFSStore()

const activeTab = ref<'content' | 'galleries' | 'settings'>('content')

const totalItems = computed(() => {
  return galleryStore.galleries.reduce((sum, gallery) => sum + gallery.items.length, 0)
})

const allItems = computed(() => {
  const items = galleryStore.galleries.flatMap(g => g.items)
  return items.sort((a, b) => b.timestamp - a.timestamp)
})

const handleItemClick = (item: any) => {
  console.log('Item clicked:', item)
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-3.5rem)] overflow-y-auto">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Profile Header -->
      <div class="bg-surface rounded-xl border border-border p-6 mb-6">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
              <svg class="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-foreground">Anonymous User</h1>
              <span class="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">Decentralized</span>
            </div>
            <p class="text-foreground-muted mb-4">
              Decentralized identity • No registration required
            </p>
            
            <!-- Stats -->
            <div class="flex gap-6 text-sm">
              <div>
                <span class="font-semibold text-foreground">{{ galleryStore.galleries.length }}</span>
                <span class="text-foreground-muted ml-1">Galleries</span>
              </div>
              <div>
                <span class="font-semibold text-foreground">{{ totalItems }}</span>
                <span class="text-foreground-muted ml-1">Items</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <router-link
              to="/galleries/new"
              class="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              New Gallery
            </router-link>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-surface rounded-xl border border-border overflow-hidden mb-6">
        <div class="flex border-b border-border">
          <button
            @click="activeTab = 'content'"
            :class="[
              'flex-1 px-6 py-3 font-medium transition-colors',
              activeTab === 'content'
                ? 'bg-accent/10 text-accent border-b-2 border-accent'
                : 'text-foreground-muted hover:text-foreground'
            ]"
          >
            Content
          </button>
          <button
            @click="activeTab = 'galleries'"
            :class="[
              'flex-1 px-6 py-3 font-medium transition-colors',
              activeTab === 'galleries'
                ? 'bg-accent/10 text-accent border-b-2 border-accent'
                : 'text-foreground-muted hover:text-foreground'
            ]"
          >
            Galleries
          </button>
          <button
            @click="activeTab = 'settings'"
            :class="[
              'flex-1 px-6 py-3 font-medium transition-colors',
              activeTab === 'settings'
                ? 'bg-accent/10 text-accent border-b-2 border-accent'
                : 'text-foreground-muted hover:text-foreground'
            ]"
          >
            Settings
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Content Tab -->
        <div v-if="activeTab === 'content'">
          <div v-if="allItems.length === 0" class="text-center py-12">
            <svg class="w-24 h-24 mx-auto mb-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg text-foreground-muted mb-2">No content yet</p>
            <p class="text-sm text-foreground-muted mb-4">Upload your first image to get started</p>
            <router-link
              to="/upload"
              class="inline-block px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Upload Content
            </router-link>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <ContentCard
              v-for="item in allItems"
              :key="item.id"
              :item="item"
              :compact="true"
              @click="handleItemClick(item)"
            />
          </div>
        </div>

        <!-- Galleries Tab -->
        <div v-if="activeTab === 'galleries'">
          <div v-if="galleryStore.galleries.length === 0" class="text-center py-12">
            <svg class="w-24 h-24 mx-auto mb-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p class="text-lg text-foreground-muted mb-2">No galleries yet</p>
            <p class="text-sm text-foreground-muted mb-4">Create your first gallery to organize content</p>
            <router-link
              to="/galleries/new"
              class="inline-block px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Create Gallery
            </router-link>
          </div>
          <div v-else class="grid gap-4">
            <router-link
              v-for="gallery in galleryStore.galleries"
              :key="gallery.id"
              :to="`/galleries/${gallery.id}`"
              class="block p-6 bg-surface border border-border rounded-xl hover:bg-surface-hover hover:border-accent transition-all"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-lg font-semibold text-foreground">{{ gallery.name }}</h3>
                    <span v-if="gallery.isPrivate" class="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">
                      🔒 Private
                    </span>
                  </div>
                  <p v-if="gallery.description" class="text-foreground-muted mb-3">{{ gallery.description }}</p>
                  <div class="flex items-center gap-4 text-sm text-foreground-muted">
                    <span>{{ gallery.items.length }} items</span>
                    <span>Created {{ new Date(gallery.created).toLocaleDateString() }}</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <!-- IPFS Status -->
          <div class="bg-surface border border-border rounded-xl p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">IPFS Node Status</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-foreground-muted">Status</span>
                <span :class="[
                  'font-medium',
                  ipfsStore.isReady ? 'text-green-500' : 'text-yellow-500'
                ]">
                  {{ ipfsStore.isReady ? 'Connected' : ipfsStore.isInitializing ? 'Initializing...' : 'Disconnected' }}
                </span>
              </div>
              <div v-if="ipfsStore.peerId" class="flex items-center justify-between">
                <span class="text-foreground-muted">Peer ID</span>
                <code class="text-xs bg-background px-2 py-1 rounded text-foreground font-mono">
                  {{ ipfsStore.peerId?.slice(0, 20) }}...
                </code>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="bg-surface border border-border rounded-xl p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Privacy & Security</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-foreground font-medium">Decentralized Identity</p>
                  <p class="text-sm text-foreground-muted">No registration, fully anonymous</p>
                </div>
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-foreground font-medium">End-to-End Encryption</p>
                  <p class="text-sm text-foreground-muted">Private content is encrypted</p>
                </div>
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div class="bg-surface border border-border rounded-xl p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Data Management</h3>
            <div class="space-y-3">
              <p class="text-sm text-foreground-muted">
                Your data is stored on IPFS and OrbitDB. You control what you share and who can access it.
              </p>
              <button class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors">
                Export All Data
              </button>
              <button class="w-full px-4 py-2 bg-background border border-accent rounded-lg text-accent hover:bg-accent/10 transition-colors">
                Clear Local Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
