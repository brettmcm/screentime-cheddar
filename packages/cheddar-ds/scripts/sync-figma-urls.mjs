#!/usr/bin/env node
/**
 * Rewrites the `// url=...` header in every Code Connect template (.figma.ts)
 * to point at the library described by `figma.config.json` -> `library.fileKey`.
 *
 * URLs are normalized to the canonical, slug-less form
 *   https://www.figma.com/design/{fileKey}?node-id={X-Y}
 * Figma only routes on the fileKey, so the human-readable file-name slug is
 * dropped to keep all templates consistent regardless of which file (or fork)
 * they were captured from. `node-id` is preserved.
 *
 * Usage:
 *   node scripts/sync-figma-urls.mjs          # rewrite in place
 *   node scripts/sync-figma-urls.mjs --check  # exit 1 if any file is stale
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'node:fs/promises' // Node 22+

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONFIG_PATH = resolve(ROOT, 'figma.config.json')

const args = new Set(process.argv.slice(2))
const CHECK_ONLY = args.has('--check')

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
const fileKey = config.library?.fileKey
const includes = config.codeConnect?.include ?? ['src/components/**/*.figma.ts']

if (!fileKey) {
  console.error(
    'sync-figma-urls: missing `library.fileKey` in figma.config.json',
  )
  process.exit(2)
}

// Matches the fileKey + optional trailing slug segment of any figma.com URL.
//   1: leading `https://(www.)?figma.com/(design|file)/`
//   2: fileKey segment (replaced)
//   3: optional `/{slug}` segment (dropped — slug is cosmetic, Figma redirects)
const URL_RE =
  /(https:\/\/(?:www\.)?figma\.com\/(?:design|file)\/)([^/\s?]+)(\/[^?\s]*)?/g

const HEADER_RE = /^\/\/\s*url=(.+)$/m

const files = []
for (const pattern of includes) {
  for await (const match of glob(pattern, { cwd: ROOT })) {
    files.push(resolve(ROOT, match))
  }
}

let changed = 0
let stale = []

for (const file of files) {
  const original = readFileSync(file, 'utf8')
  const headerMatch = original.match(HEADER_RE)
  if (!headerMatch) {
    console.warn(`sync-figma-urls: no \`// url=\` header in ${rel(file)}`)
    continue
  }

  const oldUrl = headerMatch[1].trim()
  const newUrl = oldUrl.replace(
    URL_RE,
    (_match, prefix) => `${prefix}${fileKey}`,
  )

  if (newUrl === oldUrl) continue

  if (CHECK_ONLY) {
    stale.push(rel(file))
    continue
  }

  const updated = original.replace(HEADER_RE, `// url=${newUrl}`)
  writeFileSync(file, updated)
  changed++
  console.log(`updated ${rel(file)}`)
}

if (CHECK_ONLY) {
  if (stale.length) {
    console.error(
      `sync-figma-urls: ${stale.length} file(s) out of sync with figma.config.json:`,
    )
    for (const f of stale) console.error(`  - ${f}`)
    console.error('Run: npm run figma:url-sync')
    process.exit(1)
  }
  console.log(`sync-figma-urls: ${files.length} file(s) up to date.`)
  process.exit(0)
}

console.log(
  `sync-figma-urls: ${changed} file(s) updated, ${files.length - changed} unchanged.`,
)

function rel(p) {
  return p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p
}
