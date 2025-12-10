<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const passphrase = ref('')
const confirmPassphrase = ref('')
const isNewUser = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const showPassphrase = ref(false)

const handleSubmit = async () => {
  error.value = null
  
  if (!passphrase.value.trim()) {
    error.value = 'Please enter a passphrase'
    return
  }

  if (isNewUser.value && passphrase.value !== confirmPassphrase.value) {
    error.value = 'Passphrases do not match'
    return
  }

  if (passphrase.value.length < 12) {
    error.value = 'Passphrase must be at least 12 characters long'
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual passphrase-based identity generation
    // This would derive cryptographic keys from the passphrase
    // For now, just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store in local storage or session (in real app, derive keys)
    localStorage.setItem('userIdentity', 'authenticated')
    
    // Navigate to feed
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}

const handleSkip = () => {
  // Anonymous mode - no identity
  router.push('/')
}

const toggleMode = () => {
  isNewUser.value = !isNewUser.value
  error.value = null
  confirmPassphrase.value = ''
}
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-2xl mb-4">
          <svg class="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Bilderbrett</h1>
        <p class="text-foreground-muted">Decentralized Gallery Platform</p>
      </div>

      <!-- Login Card -->
      <div class="bg-surface border border-border rounded-xl p-8">
        <h2 class="text-2xl font-bold text-foreground mb-2">
          {{ isNewUser ? 'Create Identity' : 'Enter Your Passphrase' }}
        </h2>
        <p class="text-sm text-foreground-muted mb-6">
          {{ isNewUser 
            ? 'Your passphrase generates a cryptographic identity. Keep it safe!' 
            : 'Enter your passphrase to restore your decentralized identity' 
          }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Passphrase Input -->
          <div>
            <label for="passphrase" class="block text-sm font-medium text-foreground mb-2">
              Passphrase *
            </label>
            <div class="relative">
              <input
                id="passphrase"
                v-model="passphrase"
                :type="showPassphrase ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter a strong passphrase"
              />
              <button
                type="button"
                @click="showPassphrase = !showPassphrase"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
              >
                <svg v-if="!showPassphrase" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-foreground-muted">Minimum 12 characters</p>
          </div>

          <!-- Confirm Passphrase (New User Only) -->
          <div v-if="isNewUser">
            <label for="confirm" class="block text-sm font-medium text-foreground mb-2">
              Confirm Passphrase *
            </label>
            <input
              id="confirm"
              v-model="confirmPassphrase"
              :type="showPassphrase ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Re-enter your passphrase"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-accent/10 border border-accent rounded-lg text-accent text-sm">
            {{ error }}
          </div>

          <!-- Warning for New Users -->
          <div v-if="isNewUser" class="p-3 bg-surface-hover border border-border rounded-lg">
            <div class="flex gap-2">
              <svg class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div class="text-xs text-foreground-muted">
                <p class="font-semibold text-foreground mb-1">Important!</p>
                <p>Your passphrase is the ONLY way to access your identity. There is no password recovery. Store it securely!</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!isLoading">{{ isNewUser ? 'Create Identity' : 'Login' }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>

          <!-- Toggle Mode -->
          <button
            type="button"
            @click="toggleMode"
            class="w-full text-center text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            {{ isNewUser ? 'Already have an identity? Login' : 'New user? Create identity' }}
          </button>
        </form>
      </div>

      <!-- Anonymous Access -->
      <div class="mt-6 text-center">
        <button
          @click="handleSkip"
          class="text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          Continue without identity (anonymous mode)
        </button>
      </div>

      <!-- Info -->
      <div class="mt-8 p-4 bg-surface/50 border border-border rounded-lg">
        <h3 class="text-sm font-semibold text-foreground mb-2">Zero-Knowledge Authentication</h3>
        <ul class="text-xs text-foreground-muted space-y-1">
          <li>• No email, no phone, no personal data</li>
          <li>• Your passphrase never leaves your device</li>
          <li>• Cryptographic keys derived locally</li>
          <li>• Fully decentralized identity</li>
        </ul>
      </div>
    </div>
  </div>
</template>
