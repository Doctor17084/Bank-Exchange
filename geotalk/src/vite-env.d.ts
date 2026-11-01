/// <reference types="vite/client" />

interface GeotalkDesktop {
  platform: string
  isElectron: boolean
}

interface Window {
  geotalkDesktop?: GeotalkDesktop
}
