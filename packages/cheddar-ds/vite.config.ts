import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // The /public directory is gallery-only. The internal package build validates
  // the source entry points; the product app bundles those sources directly.
  publicDir: command === 'build' ? false : 'public',
  build: {
    lib: {
      // Build every internal API entry so the independent package check covers
      // the same boundaries the app imports from source.
      entry: {
        index: 'src/index.ts',
        'demo-assets': 'src/demo-assets/index.ts',
        'tokens/tokens': 'src/tokens/tokens.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
  },
}))
