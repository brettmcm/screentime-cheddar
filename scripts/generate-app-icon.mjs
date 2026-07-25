#!/usr/bin/env node
/**
 * Rasterizes scripts/assets/app-icon.svg into the iOS AppIcon asset catalog.
 *
 * iOS app icons must not carry an alpha channel, so every PNG is composited onto
 * an opaque background and encoded as 8-bit RGB (PNG color type 2).
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const svgPath = path.join(root, 'scripts/assets/app-icon.svg')
const outDir = path.join(
  root,
  'apps/ios/CheddarApp/Resources/Assets.xcassets/AppIcon.appiconset',
)

/** Opaque backdrop; matches the artwork's own background (brand-100). */
const BACKGROUND = '#64002D'

/** Filenames must stay in sync with AppIcon.appiconset/Contents.json. */
const targets = [
  ['AppIcon-1024.png', 1024],
  ['AppIcon-20@2x.png', 40],
  ['AppIcon-20@3x.png', 60],
  ['AppIcon-29@2x.png', 58],
  ['AppIcon-29@3x.png', 87],
  ['AppIcon-40@2x.png', 80],
  ['AppIcon-40@3x.png', 120],
  ['AppIcon-60@2x.png', 120],
  ['AppIcon-60@3x.png', 180],
]

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/** Encodes RGBA pixels as an RGB PNG, dropping the alpha channel. */
function encodeOpaquePng(size, rgba) {
  const stride = size * 3
  const raw = Buffer.alloc(size * (stride + 1))
  let o = 0
  for (let y = 0; y < size; y++) {
    raw[o++] = 0 // no per-scanline filter
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      raw[o++] = rgba[i]
      raw[o++] = rgba[i + 1]
      raw[o++] = rgba[i + 2]
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor, no alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** Playwright's own download is optional here; fall back to system Chrome. */
function resolveBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean)
  const found = candidates.find((p) => fs.existsSync(p))
  if (!found) {
    throw new Error(
      'No Chromium build found. Run `npx playwright install chromium` or set CHROME_PATH.',
    )
  }
  return found
}

const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ executablePath: resolveBrowser() })
const page = await browser.newPage()

for (const [filename, size] of targets) {
  const base64 = await page.evaluate(
    async ({ svg, size, background }) => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      const image = new Image()
      image.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      await image.decode()

      ctx.fillStyle = background
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(image, 0, 0, size, size)

      const { data } = ctx.getImageData(0, 0, size, size)
      const parts = []
      for (let i = 0; i < data.length; i += 0x8000) {
        parts.push(String.fromCharCode.apply(null, data.subarray(i, i + 0x8000)))
      }
      return btoa(parts.join(''))
    },
    { svg, size, background: BACKGROUND },
  )

  const png = encodeOpaquePng(size, Buffer.from(base64, 'base64'))
  fs.writeFileSync(path.join(outDir, filename), png)
  console.log(`Wrote ${filename} (${size}×${size})`)
}

await browser.close()
