/**
 * Gallery Store
 * Manages gallery state and OrbitDB operations
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface GalleryItem {
  id: string
  cid: string
  title: string
  description?: string
  timestamp: number
  encrypted: boolean
}

export interface Gallery {
  id: string
  name: string
  description?: string
  items: GalleryItem[]
  isPrivate: boolean
  created: number
  updated: number
}

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const galleries = ref<Gallery[]>([])
  const currentGallery = ref<Gallery | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Create a new gallery
   */
  function createGallery(name: string, description?: string, isPrivate = false): Gallery {
    const gallery: Gallery = {
      id: `gallery-${Date.now()}`,
      name,
      description,
      items: [],
      isPrivate,
      created: Date.now(),
      updated: Date.now(),
    }

    galleries.value.push(gallery)
    return gallery
  }

  /**
   * Add item to gallery
   */
  function addItemToGallery(
    galleryId: string,
    cid: string,
    title: string,
    description?: string,
    encrypted = false
  ): GalleryItem | null {
    const gallery = galleries.value.find((g) => g.id === galleryId)
    if (!gallery) {
      error.value = 'Gallery not found'
      return null
    }

    const item: GalleryItem = {
      id: `item-${Date.now()}`,
      cid,
      title,
      description,
      timestamp: Date.now(),
      encrypted,
    }

    gallery.items.push(item)
    gallery.updated = Date.now()

    return item
  }

  /**
   * Remove item from gallery
   */
  function removeItemFromGallery(galleryId: string, itemId: string): boolean {
    const gallery = galleries.value.find((g) => g.id === galleryId)
    if (!gallery) {
      error.value = 'Gallery not found'
      return false
    }

    const index = gallery.items.findIndex((item) => item.id === itemId)
    if (index === -1) {
      error.value = 'Item not found'
      return false
    }

    gallery.items.splice(index, 1)
    gallery.updated = Date.now()

    return true
  }

  /**
   * Set current gallery
   */
  function setCurrentGallery(galleryId: string | null) {
    if (galleryId === null) {
      currentGallery.value = null
      return
    }

    const gallery = galleries.value.find((g) => g.id === galleryId)
    if (gallery) {
      currentGallery.value = gallery
    } else {
      error.value = 'Gallery not found'
    }
  }

  /**
   * Delete gallery
   */
  function deleteGallery(galleryId: string): boolean {
    const index = galleries.value.findIndex((g) => g.id === galleryId)
    if (index === -1) {
      error.value = 'Gallery not found'
      return false
    }

    galleries.value.splice(index, 1)

    if (currentGallery.value?.id === galleryId) {
      currentGallery.value = null
    }

    return true
  }

  return {
    // State
    galleries,
    currentGallery,
    isLoading,
    error,
    // Actions
    createGallery,
    addItemToGallery,
    removeItemFromGallery,
    setCurrentGallery,
    deleteGallery,
  }
})
