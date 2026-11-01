# GEOTALK (Phase 1)

Georgian next-generation communication platform — interactive desktop/web shell.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · Zustand · Electron (optional shell)

## Run

```bash
cd geotalk
npm install
npm run dev
```

Open http://localhost:5173

### Electron (optional)

```bash
npm run electron:dev
```

### Production build

```bash
npm run build
npm run preview
```

## Phase 1

- Premium dark UI (KA + EN)
- Dashboard, sidebar, servers/channels, chat, DMs, friends, voice UI, feed, bots, search, AI, notifications, profile, admin, files
- Client state + localStorage persistence
- Mock realtime ticks in active text channels

## Phase 2 stubs

Auth API, PostgreSQL, Socket.IO, WebRTC signaling — see `src/lib/api.ts` and architecture doc.
