// Guards the bundled demo assets: every file the manifest claims must exist on
// disk, and every file on disk should be claimed by the manifest. A missing
// asset otherwise fails silently at build time and ships a broken image, so
// this runs as part of `npm run verify` and before publishing.
import { readdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

// Imported straight from the TypeScript module the manifest itself consumes, so
// the two cannot drift. Relies on Node's native type stripping (Node >= 22.6).
const { demoAssetFiles, demoAssetDirectory } = await import(
  new URL('../src/demo-assets/verify.ts', import.meta.url).href
)

const assetDir = resolve(root, demoAssetDirectory)
const expected = [...new Set(demoAssetFiles)].sort()

let onDisk = []
try {
  onDisk = readdirSync(assetDir)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => statSync(resolve(assetDir, name)).isFile())
    .sort()
} catch {
  console.error(`missing asset directory: ${demoAssetDirectory}`)
  process.exit(1)
}

const missing = expected.filter((name) => !onDisk.includes(name))
const orphaned = onDisk.filter((name) => !expected.includes(name))

for (const name of missing) console.error(`missing asset file: ${demoAssetDirectory}/${name}`)
for (const name of orphaned) console.warn(`unreferenced asset file: ${demoAssetDirectory}/${name}`)

if (missing.length > 0) {
  console.error(
    `\n${missing.length} demo asset(s) referenced by the manifest do not exist. Add the file or remove the manifest entry.`,
  )
  process.exit(1)
}

const empty = expected.filter((name) => statSync(resolve(assetDir, name)).size === 0)
for (const name of empty) console.error(`empty asset file: ${demoAssetDirectory}/${name}`)
if (empty.length > 0) process.exit(1)

console.log(
  `demo assets ok — ${expected.length} referenced file(s)${
    orphaned.length > 0 ? `, ${orphaned.length} unreferenced` : ''
  }`,
)
