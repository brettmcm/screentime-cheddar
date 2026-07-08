// One-shot generator for tokens/cheddar.tokens.json — mirrors src/styles/tokens.css
// and the Figma "Cheddar Product Design System" variables. Run: node scripts/gen-tokens-json.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '../tokens/cheddar.tokens.json')

const round = (n) => Math.round(n * 100000) / 100000
function color(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const value = { colorSpace: 'srgb', components: [round(r), round(g), round(b)], hex }
  if (alpha != null) value.alpha = alpha
  return { $value: value }
}
const px = (value) => ({ $value: { value, unit: 'px' } })

// Semantic color with light + dark modes (dark under $extensions).
function sem(light, dark) {
  return { $value: light, $extensions: { 'com.cheddar.mode': { dark } } }
}

const primitives = {
  black: { 100: ['#000000'], 200: ['#000000', 0.8], 300: ['#000000', 0.56], 400: ['#000000', 0.4], 500: ['#000000', 0.2], 600: ['#000000', 0.08] },
  white: { 100: ['#ffffff'], 200: ['#ffffff', 0.8], 300: ['#ffffff', 0.6], 400: ['#ffffff', 0.4], 500: ['#ffffff', 0.2], 600: ['#ffffff', 0.1] },
  brand: { 100: ['#64002d'], 200: ['#850056'], 300: ['#c9109b'], 400: ['#ff91f2'], 500: ['#ffc6f8'], 600: ['#ffebfd'] },
  green: { 100: ['#0a3c00'], 200: ['#0f5d00'], 300: ['#5aba00'], 400: ['#b0fe00'], 500: ['#d4ff72'], 600: ['#f2ffd1'] },
  purple: { 100: ['#32008f'], 200: ['#5009d3'], 300: ['#7747ff'], 400: ['#aa8bff'], 500: ['#cebeff'], 600: ['#eae5ff'] },
  blue: { 100: ['#0a008f'], 200: ['#0030cc'], 300: ['#007bee'], 400: ['#56d7ff'], 500: ['#99eeff'], 600: ['#d6f8ff'] },
}

const colorNode = { $description: 'Color tokens sourced from the Cheddar Figma design system.' }
for (const [family, steps] of Object.entries(primitives)) {
  colorNode[family] = { $type: 'color' }
  for (const [step, args] of Object.entries(steps)) colorNode[family][step] = color(...args)
}
colorNode.cheddar = {
  $type: 'color',
  $description: 'Cheddar product-brand specific colors — no Figma variable.',
  'black-cherry': color('#251f23'),
  orange: color('#ff8b00'),
}

const b = (n) => `{color.brand.${n}}`
const bl = (n) => `{color.black.${n}}`
const w = (n) => `{color.white.${n}}`
colorNode.semantic = {
  $description: 'Semantic colors. $value is the Light mode; Dark mode lives under $extensions and in src/styles/tokens.css.',
  brand: { $type: 'color', 100: { $value: b(100) }, 200: { $value: b(200) }, 300: { $value: b(300) }, 400: { $value: b(400) }, 500: { $value: b(500) }, 600: { $value: b(600) } },
  foreground: {
    $type: 'color',
    primary: sem(bl(100), w(100)),
    secondary: sem(bl(300), w(300)),
    tertiary: sem(bl(600), w(600)),
    'brand-primary': sem(b(200), b(400)),
    'brand-secondary': sem(b(100), b(600)),
    'brand-tertiary': sem(b(600), b(100)),
    'brand-highlight': sem(b(400), b(400)),
    'on-reverse': sem(w(100), b(100)),
    'on-reverse-secondary': sem(w(300), b(200)),
    'brand-reverse': sem(b(100), b(600)),
    'brand-reverse-secondary': sem(b(400), b(200)),
    'brand-reverse-tertiary': sem(b(200), b(400)),
  },
  bg: {
    $type: 'color',
    'brand-primary': sem(b(600), b(100)),
    'brand-secondary': sem(b(100), b(600)),
    'brand-tertiary': sem(b(500), b(200)),
    'brand-shade': sem(b(400), b(300)),
    'on-brand': sem(w(100), b(200)),
  },
  icon: {
    $type: 'color',
    primary: sem(b(200), b(400)),
    secondary: sem(b(400), b(200)),
  },
}

// Extended brand themes (Figma "Blue"/"Green"/"Purple" collections). Each theme
// re-points the semantic brand ramp to a different primitive family; all other
// semantic tokens inherit from Brand. Mirrors the [data-brand] layer in tokens.css.
const themeRamp = (family) => ({
  $type: 'color',
  100: { $value: `{color.${family}.100}` },
  200: { $value: `{color.${family}.200}` },
  300: { $value: `{color.${family}.300}` },
  400: { $value: `{color.${family}.400}` },
  500: { $value: `{color.${family}.500}` },
  600: { $value: `{color.${family}.600}` },
})
colorNode.semantic['brand-theme'] = {
  $description:
    'Selectable brand accent ramps. Applied in CSS via [data-brand="…"], which overrides --cds-color-brand-100…600.',
  magenta: themeRamp('brand'),
  blue: themeRamp('blue'),
  green: themeRamp('green'),
  purple: themeRamp('purple'),
}

const tokens = {
  $description:
    'Cheddar design tokens (DTCG 2025.10). Names mirror the web code syntax in src/styles/tokens.css: primitives are --token-color-*, everything else is --cds-*.',
  color: colorNode,
  size: {
    $description: 'Sizing scale from the Figma "Size" collection (--cds-size-*).',
    border: { $type: 'dimension', ...px(1) },
    'icon-stroke': { $type: 'dimension', ...px(1) },
    padding: { $type: 'dimension', xxxs: px(2), xxs: px(4), xs: px(8), s: px(12), m: px(16), l: px(24), xl: px(32), xxl: px(40) },
    gap: { $type: 'dimension', xs: px(4), s: px(8), m: px(16), l: px(24) },
    font: { $type: 'dimension', xs: px(14), s: px(16), m: px(18), l: px(24), xl: px(64), display: px(80) },
    corner: { $type: 'dimension', xxsmall: px(4), xsmall: px(8), small: px(12), medium: px(16), large: px(24), xlarge: px(40), full: px(9999) },
    icon: { $type: 'dimension', small: px(12), medium: px(16), large: px(24) },
  },
  font: {
    $description: 'Font family tokens.',
    family: {
      text: { $type: 'fontFamily', $value: ['Mona Sans', 'Inter', 'system-ui', 'sans-serif'] },
      display: { $type: 'fontFamily', $value: ['Oswald', 'Mona Sans', 'system-ui', 'sans-serif'] },
    },
  },
  shadow: {
    $description: 'Shadow primitives for surfaces — code-only, no Figma variable.',
    surface: {
      $type: 'shadow',
      $value: {
        color: { colorSpace: 'srgb', components: [0.34510, 0.07451, 0.23922], alpha: 0.08, hex: '#58133d' },
        offsetX: { value: 0, unit: 'px' },
        offsetY: { value: 8, unit: 'px' },
        blur: { value: 24, unit: 'px' },
        spread: { value: 0, unit: 'px' },
      },
    },
  },
}

writeFileSync(out, JSON.stringify(tokens, null, 2) + '\n')
console.log('wrote', out)
