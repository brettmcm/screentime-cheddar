import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { cheddarDemoAssets } from './vite-plugin-cheddar-assets'

export default defineConfig({
  plugins: [react(), cheddarDemoAssets()],
  root: '.',
})
