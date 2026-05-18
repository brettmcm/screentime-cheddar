import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')

const distStyles = resolve(dist, 'styles')
const distTokens = resolve(dist, 'tokens')
const distFonts = resolve(dist, 'fonts')

await mkdir(distStyles, { recursive: true })
await mkdir(distTokens, { recursive: true })
await mkdir(distFonts, { recursive: true })

await cp(resolve(root, 'src/styles/tokens.css'), resolve(distStyles, 'tokens.css'))
await cp(resolve(root, 'src/styles/foundation.css'), resolve(distStyles, 'foundation.css'))
await cp(resolve(root, 'src/styles/components.css'), resolve(distStyles, 'components.css'))

await cp(
  resolve(root, 'tokens/cheddar.tokens.json'),
  resolve(distTokens, 'cheddar.tokens.json'),
)

// Font bundling: read each fontsource CSS entry, copy every referenced font file
// into dist/fonts/, and rewrite url() to point there. The result is a single
// self-contained dist/styles/fonts.css that consumers get for free with the
// main styles import — no fontsource dependency required at consumer end.
const fontEntries = [
  '@fontsource-variable/mona-sans/index.css',
  '@fontsource/oswald/400.css',
  '@fontsource/oswald/500.css',
]

const urlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g
const fontParts = []
const copiedFonts = new Set()

for (const entry of fontEntries) {
  const cssPath = resolve(root, 'node_modules', entry)
  const cssDir = dirname(cssPath)
  let css = await readFile(cssPath, 'utf8')

  const tasks = []
  css = css.replace(urlRe, (match, quote, url) => {
    if (/^(https?:|data:)/.test(url)) return match
    const cleanUrl = url.split('?')[0].split('#')[0]
    const fontFile = basename(cleanUrl)
    if (!copiedFonts.has(fontFile)) {
      copiedFonts.add(fontFile)
      tasks.push(cp(resolve(cssDir, cleanUrl), resolve(distFonts, fontFile)))
    }
    return `url(../fonts/${fontFile})`
  })
  await Promise.all(tasks)

  fontParts.push(`/* ${entry} */`, css)
}

await writeFile(resolve(distStyles, 'fonts.css'), fontParts.join('\n\n'))

await writeFile(
  resolve(distStyles, 'index.css'),
  `@import './fonts.css';\n@import './tokens.css';\n@import './foundation.css';\n@import './components.css';\n`,
)
