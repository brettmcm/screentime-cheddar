import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const RASTER_RE = /\.(png|jpe?g|gif|webp|avif)$/i

// Vite library mode forces every asset import to be inlined as a base64 data URI,
// which bloats the bundle. Append ?no-inline so Vite emits them as files instead.
const emitRasterAssets = (): Plugin => ({
  name: 'cds:emit-raster-assets',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!importer || !RASTER_RE.test(source)) return null
    if (source.includes('no-inline')) return null
    const withQuery = source.includes('?') ? `${source}&no-inline` : `${source}?no-inline`
    return this.resolve(withQuery, importer, { ...options, skipSelf: true })
  },
})

export default defineConfig(({ command }) => ({
  plugins: [react(), emitRasterAssets()],
  // The /public dir only contains assets for the gallery demo (`vite dev`).
  // Don't ship them in the library tarball.
  publicDir: command === 'build' ? false : 'public',
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
  },
}))
