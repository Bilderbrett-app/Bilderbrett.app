/**
 * IPFS Web Worker
 * Handles Helia IPFS node initialization and operations
 * Runs in a separate thread to avoid blocking the main UI
 */

import { createHelia, type Helia } from 'helia'
import { unixfs, type UnixFS } from '@helia/unixfs'

let helia: Helia | null = null
let fs: UnixFS | null = null

interface WorkerMessage {
  type: string
  id: string
  payload?: any
}

interface WorkerResponse {
  type: string
  id: string
  payload?: any
  error?: string
}

/**
 * Initialize Helia IPFS node
 */
async function initializeHelia(): Promise<void> {
  try {
    // Initialize Helia with default configuration
    helia = await createHelia()
    fs = unixfs(helia)

    postMessage({
      type: 'initialized',
      id: 'init',
      payload: {
        peerId: helia.libp2p.peerId.toString(),
      },
    } as WorkerResponse)
  } catch (error) {
    postMessage({
      type: 'error',
      id: 'init',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse)
  }
}

/**
 * Add content to IPFS
 */
async function addContent(id: string, content: Uint8Array): Promise<void> {
  if (!fs) {
    postMessage({
      type: 'error',
      id,
      error: 'IPFS not initialized',
    } as WorkerResponse)
    return
  }

  try {
    const cid = await fs.addBytes(content)
    postMessage({
      type: 'content-added',
      id,
      payload: { cid: cid.toString() },
    } as WorkerResponse)
  } catch (error) {
    postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse)
  }
}

/**
 * Get content from IPFS
 */
async function getContent(id: string, cidString: string): Promise<void> {
  if (!fs) {
    postMessage({
      type: 'error',
      id,
      error: 'IPFS not initialized',
    } as WorkerResponse)
    return
  }

  try {
    const decoder = new TextDecoder()
    let content = ''
    
    for await (const chunk of fs.cat(cidString as any)) {
      content += decoder.decode(chunk, { stream: true })
    }

    postMessage({
      type: 'content-retrieved',
      id,
      payload: { content },
    } as WorkerResponse)
  } catch (error) {
    postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse)
  }
}

/**
 * Stop Helia node
 */
async function stopHelia(id: string): Promise<void> {
  try {
    if (helia) {
      await helia.stop()
      helia = null
      fs = null
    }
    postMessage({
      type: 'stopped',
      id,
    } as WorkerResponse)
  } catch (error) {
    postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as WorkerResponse)
  }
}

// Message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, payload } = event.data

  switch (type) {
    case 'init':
      await initializeHelia()
      break
    case 'add-content':
      await addContent(id, payload.content)
      break
    case 'get-content':
      await getContent(id, payload.cid)
      break
    case 'stop':
      await stopHelia(id)
      break
    default:
      postMessage({
        type: 'error',
        id,
        error: `Unknown message type: ${type}`,
      } as WorkerResponse)
  }
}

// Export for TypeScript
export {}
