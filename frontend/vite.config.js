import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { liveProxyPlugin } from './vite-live-proxy.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), liveProxyPlugin()],
  base: process.env.VITE_BASE_PATH || '/',
})
