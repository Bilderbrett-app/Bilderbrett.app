<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import { onMounted } from 'vue'
import { useIPFSStore } from '@/stores/ipfs'

const ipfsStore = useIPFSStore()

onMounted(async () => {
  // Initialize IPFS on app start
  if (!ipfsStore.isInitialized) {
    await ipfsStore.initialize()
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NavigationBar />
    
    <!-- Main Content Area with proper spacing for fixed nav -->
    <main class="pt-14 pb-14 md:pb-0">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
