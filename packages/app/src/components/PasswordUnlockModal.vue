<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Enter Password',
  description: 'This content is encrypted. Enter the password to unlock it.'
})

const emit = defineEmits<{
  (e: 'unlock', password: string): void
  (e: 'cancel'): void
}>()

const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = () => {
  if (!password.value.trim()) {
    error.value = 'Please enter a password'
    return
  }

  error.value = null
  isLoading.value = true

  // Emit unlock event
  emit('unlock', password.value)
  
  // Reset after a short delay (parent should handle actual unlock)
  setTimeout(() => {
    isLoading.value = false
  }, 100)
}

const handleCancel = () => {
  password.value = ''
  error.value = null
  emit('cancel')
}
</script>

<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
    <!-- Modal Content -->
    <div class="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-foreground">{{ title }}</h2>
          </div>
          <button
            @click="handleCancel"
            class="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <p class="text-sm text-foreground-muted">{{ description }}</p>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autofocus
              class="w-full px-4 py-3 pr-12 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-accent/10 border border-accent rounded-lg text-accent text-sm">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="isLoading || !password"
            class="flex-1 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!isLoading">Unlock</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Unlocking...
            </span>
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-3 bg-surface-hover border border-border text-foreground font-medium rounded-lg hover:bg-background transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
