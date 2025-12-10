# Bilderbrett.app

A fully decentralized image gallery application built with Vue 3, IPFS (Helia), and OrbitDB. Everything runs in the browser without any external server dependencies.

## 🏗️ Architecture

This is a browser-only Single Page Application (SPA) that leverages Web3 technologies for decentralized storage and peer-to-peer communication.

### Core Components

| Component | Purpose |
|-----------|---------|
| **Vue 3 App** | UI, Routing, Upload, Display, Interaction |
| **Web Worker (ipfsWorker)** | Browser-IPFS-Node, OrbitDB-I/O, Pinning |
| **Helia IPFS Node** | Content-Addressed Storage, CID Management |
| **OrbitDB Stores** | Metadata: Galleries, Items, Messages, Shares, Follows |
| **Encryption Layer** | Password-Keys, User-Keys, Gallery-Keys |
| **Browser Edge Nodes (User)** | Pinning + Replication + Data Persistence |

### External Processing

- **GitHub Actions**: Handles IPNS updates and other external processing tasks
- **IPFS Deployment**: Static SPA deployed to IPFS for fully decentralized hosting

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📦 Monorepo Structure

```
Bilderbrett.app/
├── packages/
│   └── app/                 # Main Vue 3 application
│       ├── src/
│       │   ├── components/  # Reusable Vue components
│       │   ├── views/       # Page views
│       │   ├── stores/      # Pinia stores (state management)
│       │   ├── workers/     # Web Workers (IPFS, OrbitDB)
│       │   ├── composables/ # Vue composables
│       │   ├── types/       # TypeScript type definitions
│       │   ├── assets/      # Static assets (CSS, images)
│       │   └── router/      # Vue Router configuration
│       └── package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json             # Root package.json
```

## 🛠️ Technology Stack

### Frontend
- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Type-safe development
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **TanStack Vue Query**: Data fetching and caching
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework

### Decentralized Storage & Communication
- **Helia (IPFS)**: Content-addressed storage in the browser
- **@helia/unixfs**: Unix filesystem implementation for Helia
- **libp2p**: Modular peer-to-peer networking
  - WebRTC & WebSockets transports
  - Noise encryption
  - Yamux multiplexing
  - GossipSub pubsub
- **OrbitDB**: Decentralized database on top of IPFS

### Browser Features
- **Web Workers**: Run IPFS node in background thread
- **Service Workers**: (Future) Offline support and caching
- **IndexedDB**: Local data persistence

## 🔐 Security Features

The application implements multiple layers of encryption:

1. **Password-based Encryption**: User-controlled encryption keys
2. **User Keys**: Per-user cryptographic identity
3. **Gallery Keys**: Selective sharing and access control

## 🌐 Deployment

The application is designed to be deployed as a static site to IPFS:

1. Build the production bundle: `pnpm build`
2. Deploy to IPFS using your preferred method
3. (Optional) Use GitHub Actions for automated IPNS updates

## 🧪 Development

### Project Structure

- **Stores**: Manage application state using Pinia
  - `ipfs.ts`: IPFS node management
  - `gallery.ts`: Gallery and item management
  - (Future) `encryption.ts`, `orbitdb.ts`, etc.

- **Workers**: Background processing
  - `ipfs.worker.ts`: Helia IPFS node operations

- **Views**: Application pages
  - `HomeView.vue`: Main landing page
  - (Future) Gallery views, upload interface, etc.

### Adding New Features

1. Create stores in `src/stores/` for state management
2. Add workers in `src/workers/` for heavy computation
3. Create views in `src/views/` for new pages
4. Add routes in `src/router/index.ts`
5. Build reusable components in `src/components/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔮 Roadmap

- [ ] OrbitDB integration for metadata storage
- [ ] File upload and preview
- [ ] Gallery creation and management
- [ ] Encryption layer implementation
- [ ] Peer discovery and DHT
- [ ] IPNS publishing
- [ ] Gallery sharing and permissions
- [ ] Mobile-responsive design
- [ ] Dark mode support (implemented)
- [ ] Offline support with Service Workers
- [ ] Multi-user collaboration
- [ ] Comments and reactions
- [ ] Search and filtering
- [ ] Export/import functionality

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Helia Documentation](https://helia.io/)
- [OrbitDB Documentation](https://orbitdb.org/)
- [libp2p Documentation](https://libp2p.io/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
