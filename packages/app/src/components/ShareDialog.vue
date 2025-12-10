<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  contentId: string
  contentTitle: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const shareUrl = computed(() => {
  // In real implementation, this would be an IPFS CID or IPNS link
  return `${window.location.origin}/content/${props.contentId}`
})

const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const shareVia = (platform: string) => {
  const text = `Check out "${props.contentTitle}" on Bilderbrett`
  const url = encodeURIComponent(shareUrl.value)
  
  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${encodeURIComponent(props.contentTitle)}`,
    email: `mailto:?subject=${encodeURIComponent(props.contentTitle)}&body=${encodeURIComponent(text + ' ' + shareUrl.value)}`
  }
  
  if (urls[platform]) {
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
    <!-- Modal Content -->
    <div class="w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-foreground">Share</h2>
          </div>
          <button
            @click="handleClose"
            class="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- Content Info -->
        <div class="p-4 bg-background border border-border rounded-lg">
          <p class="text-sm font-medium text-foreground mb-1">Sharing:</p>
          <p class="text-foreground-muted">{{ contentTitle }}</p>
        </div>

        <!-- Copy Link -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Share Link</label>
          <div class="flex gap-2">
            <input
              :value="shareUrl"
              readonly
              class="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm font-mono focus:outline-none"
            />
            <button
              @click="copyToClipboard"
              :class="[
                'px-4 py-2 font-medium rounded-lg transition-colors',
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-accent text-white hover:bg-accent-hover'
              ]"
            >
              <span v-if="!copied">Copy</span>
              <span v-else class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Copied!
              </span>
            </button>
          </div>
        </div>

        <!-- Share via Social Media -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-3">Share via</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="shareVia('twitter')"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            
            <button
              @click="shareVia('facebook')"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            
            <button
              @click="shareVia('reddit')"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Reddit
            </button>
            
            <button
              @click="shareVia('email')"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-foreground hover:bg-surface-hover transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Email
            </button>
          </div>
        </div>

        <!-- IPFS Info -->
        <div class="p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <div class="flex gap-2">
            <svg class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-xs text-foreground-muted">
              <p class="font-semibold text-foreground mb-1">Decentralized Sharing</p>
              <p>Content is stored on IPFS and can be accessed from any gateway. The link will remain valid as long as someone pins the content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
