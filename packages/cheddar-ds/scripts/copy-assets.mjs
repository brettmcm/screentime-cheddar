import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')
const require = createRequire(resolve(root, 'package.json'))

const distStyles = resolve(dist, 'styles')
const distTokens = resolve(dist, 'tokens')
const distFonts = resolve(dist, 'fonts')

await mkdir(distStyles, { recursive: true })
await mkdir(distTokens, { recursive: true })
await mkdir(distFonts, { recursive: true })

// src/styles/index.css is the one place the layer list lives — the gallery imports
// it too. Deriving the publish order from it means adding a component stylesheet
// there is all it takes; forgetting to register it here can't silently ship a
// component with no styles.
const layerList = await readFile(resolve(root, 'src/styles/index.css'), 'utf8')
const layers = [...layerList.matchAll(/@import\s+'\.\/([^']+)';/g)].map(([, file]) => file)

// tokens.css and foundation.css keep their own export paths. Everything else is
// published as a single components.css, because that path is part of the exports map.
const standalone = ['tokens.css', 'foundation.css']
for (const file of standalone) {
  await cp(resolve(root, 'src/styles', file), resolve(distStyles, file))
}

const componentSheets = layers.filter(
  (file) => !standalone.includes(file) && file !== 'fonts.css',
)
if (componentSheets.length === 0) {
  throw new Error('copy-assets: no component stylesheets found in src/styles/index.css')
}
const componentCss = []
for (const sheet of componentSheets) {
  componentCss.push(
    `/* src/styles/${sheet} */`,
    await readFile(resolve(root, 'src/styles', sheet), 'utf8'),
  )
}
await writeFile(resolve(distStyles, 'components.css'), componentCss.join('\n\n'))

await cp(
  resolve(root, 'tokens/cheddar.tokens.json'),
  resolve(distTokens, 'cheddar.tokens.json'),
)

// `files.mjs` holds the demo-asset filename list as plain ESM so the build check
// can read it without a build step. tsc does not copy non-TS inputs to outDir, so
// the emitted verify.d.ts would import a `./files.mjs` that isn't there.
const distDemoAssets = resolve(dist, 'demo-assets')
await mkdir(distDemoAssets, { recursive: true })
for (const file of ['files.mjs', 'files.d.mts']) {
  await cp(resolve(root, 'src/demo-assets', file), resolve(distDemoAssets, file))
}

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
  const cssPath = require.resolve(entry)
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
