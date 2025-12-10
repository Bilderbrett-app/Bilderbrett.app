/**
 * IPFS Store
 * Manages IPFS node state and operations through Web Worker
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useIPFSStore = defineStore('ipfs', () => {
  // State
  const worker = ref<Worker | null>(null)
  const isInitialized = ref(false)
  const isInitializing = ref(false)
  const peerId = ref<string | null>(null)
  const error = ref<string | null>(null)

  // Computed
  const isReady = computed(() => isInitialized.value && !error.value)

  // Message callbacks
  const messageCallbacks = new Map<string, (payload: any, error?: string) => void>()

  /**
   * Initialize IPFS worker
   */
  async function initialize() {
    if (isInitialized.value || isInitializing.value) {
      return
    }

    try {
      isInitializing.value = true
      error.value = null

      // Create worker
      worker.value = new Worker(new URL('../workers/ipfs.worker.ts', import.meta.url), {
        type: 'module',
      })

      // Set up message handler
      worker.value.onmessage = (event) => {
        const { type, id, payload, error: errMsg } = event.data

        if (type === 'initialized') {
          isInitialized.value = true
          isInitializing.value = false
          peerId.value = payload.peerId
        } else if (type === 'error') {
          error.value = errMsg || 'Unknown error'
          isInitializing.value = false
        }

        // Call registered callback
        const callback = messageCallbacks.get(id)
        if (callback) {
          callback(payload, errMsg)
          messageCallbacks.delete(id)
        }
      }

      // Send init message
      worker.value.postMessage({ type: 'init', id: 'init' })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize IPFS'
      isInitializing.value = false
    }
  }

  /**
   * Add content to IPFS
   */
  function addContent(content: Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!worker.value || !isReady.value) {
        reject(new Error('IPFS not ready'))
        return
      }

      const id = `add-${Date.now()}`
      messageCallbacks.set(id, (payload, error) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(payload.cid)
        }
      })

      worker.value.postMessage({
        type: 'add-content',
        id,
        payload: { content },
      })
    })
  }

  /**
   * Get content from IPFS
   */
  function getContent(cid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!worker.value || !isReady.value) {
        reject(new Error('IPFS not ready'))
        return
      }

      const id = `get-${Date.now()}`
      messageCallbacks.set(id, (payload, error) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(payload.content)
        }
      })

      worker.value.postMessage({
        type: 'get-content',
        id,
        payload: { cid },
      })
    })
  }

  /**
   * Stop IPFS node
   */
  async function stop() {
    if (!worker.value) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      const id = `stop-${Date.now()}`
      messageCallbacks.set(id, (_, error) => {
        if (error) {
          reject(new Error(error))
        } else {
          worker.value?.terminate()
          worker.value = null
          isInitialized.value = false
          peerId.value = null
          resolve()
        }
      })

      worker.value!.postMessage({ type: 'stop', id })
    })
  }

  return {
    // State
    isInitialized,
    isInitializing,
    isReady,
    peerId,
    error,
    // Actions
    initialize,
    addContent,
    getContent,
    stop,
  }
})
