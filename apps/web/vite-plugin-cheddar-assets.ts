import { readdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, posix } from 'node:path'
import type { Plugin } from 'vite'

/**
 * `@screentime/cheddar-ds/demo-assets` is a manifest of plain strings, not module
 * imports, and every entry is a root-absolute `/assets/<name>-<hash>.<ext>` URL
 * pointing at a file inside the package's own `dist/assets`. A bundler cannot
 * follow a string, so the app has to put those files on that path itself: served
 * from the package in dev, copied into the bundle at build. The DS filenames are
 * already content-hashed, so they are emitted verbatim and the manifest URLs
 * resolve unchanged.
 */
export function cheddarDemoAssets(): Plugin {
  const require = createRequire(import.meta.url)
  const packageRoot = dirname(require.resolve('@screentime/cheddar-ds/package.json'))
  const assetsDir = join(packageRoot, 'dist', 'assets')
  const urlPrefix = '/assets/'

  const listAssets = async () => {
    const entries = await readdir(assetsDir, { withFileTypes: true })
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
  }

  return {
    name: 'cheddar-demo-assets',

    async buildStart() {
      if (this.meta.watchMode) return
      for (const name of await listAssets()) {
        this.emitFile({
          type: 'asset',
          fileName: posix.join('assets', name),
          source: await readFile(join(assetsDir, name)),
        })
      }
    },

    async configureServer(server) {
      const available = new Set(await listAssets())
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url?.startsWith(urlPrefix)) return next()
        const name = decodeURIComponent(url.slice(urlPrefix.length))
        if (!available.has(name)) return next()
        readFile(join(assetsDir, name)).then(
          (file) => {
            res.setHeader('Content-Type', contentType(name))
            res.setHeader('Cache-Control', 'no-cache')
            res.end(file)
          },
          () => next(),
        )
      })
    },
  }
}

function contentType(name: string) {
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.svg')) return 'image/svg+xml'
  if (name.endsWith('.webp')) return 'image/webp'
  return 'image/png'
}
