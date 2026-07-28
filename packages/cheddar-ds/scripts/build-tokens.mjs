// Generates the web token outputs from tokens/cheddar.tokens.json, which is
// the single source of truth. Nothing here should be edited to change a token
// value — edit the JSON and re-run `npm run tokens:build`.
//
// Outputs:
//   src/styles/tokens.css              web / React (CSS custom properties)
//   src/tokens/tokens.ts               typed accessors for React consumers
// Pass --check to fail instead of writing when an output is stale (CI guard).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens/cheddar.tokens.json'), 'utf8'))

const MODES = ['light', 'dark', 'brand']
const BRANDS = ['magenta', 'blue', 'green', 'purple']
const isMeta = (key) => key.startsWith('$')

// ---------------------------------------------------------------- traversal

/** Walk the token tree, yielding [dottedPath, node] for every leaf token. */
function* leaves(node, path = []) {
  for (const [key, value] of Object.entries(node)) {
    if (isMeta(key) || value == null || typeof value !== 'object') continue
    if ('$value' in value) yield [[...path, key].join('.'), value]
    else yield* leaves(value, [...path, key])
  }
}

const at = (path) => path.split('.').reduce((node, key) => node?.[key], tokens)

/** Resolve a token node for a given mode, falling back to the base $value. */
function forMode(node, mode) {
  if (mode === 'light') return node
  const override = node.$extensions?.['com.cheddar.mode']?.[mode]
  return override ?? node
}

const isRef = (value) => typeof value === 'string' && value.startsWith('{') && value.endsWith('}')

// ------------------------------------------------------------------ naming

function cssVarName(path) {
  if (path.startsWith('color.semantic.brand.')) return `--cds-color-brand-${path.split('.').pop()}`
  if (path.startsWith('color.semantic.'))
    return `--cds-color-${path.slice('color.semantic.'.length).replace(/\./g, '-')}`
  if (path.startsWith('color.')) return `--token-color-${path.slice(6).replace(/\./g, '-')}`
  if (path.startsWith('size.')) return `--cds-size-${path.slice(5).replace(/\./g, '-')}`
  if (path.startsWith('font.family.')) return `--cds-font-family-${path.slice(12)}`
  if (path.startsWith('type.')) return `--cds-type-${path.slice(5).replace(/\./g, '-')}`
  if (path.startsWith('shadow.')) return `--cds-shadow-${path.slice(7).replace(/\./g, '-')}`
  throw new Error(`no CSS variable mapping for token "${path}"`)
}

const camel = (parts) =>
  parts
    .join('-')
    .split(/[-.]/)
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join('')

// ------------------------------------------------------------- color maths

const clamp01 = (n) => Math.max(0, Math.min(1, n))
const round = (n) => Math.round(n * 100000) / 100000

function rgbaString({ components, alpha }) {
  const [r, g, b] = components.map((c) => Math.round(clamp01(c) * 255))
  return alpha != null && alpha < 1
    ? `rgba(${r}, ${g}, ${b}, ${round(alpha)})`
    : `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/** Concrete color for a token path in a given mode, for a given brand ramp. */
function resolveColor(path, mode, brand) {
  const node = at(path)
  if (!node) throw new Error(`unknown token "${path}"`)
  return resolveColorNode(forMode(node, mode), mode, brand)
}

function resolveColorNode(node, mode, brand) {
  const recipe = node.$extensions?.['com.cheddar.mix']
  if (recipe) {
    const [first, second] = recipe.stops
    const a = resolveColorRef(first.ref, mode, brand)
    if (second.ref === 'transparent') {
      return { components: a.components, alpha: round((a.alpha ?? 1) * (first.weight / 100)) }
    }
    const b = resolveColorRef(second.ref, mode, brand)
    const w = first.weight / 100
    return {
      components: a.components.map((c, i) => round(c * w + b.components[i] * (1 - w))),
      alpha: round((a.alpha ?? 1) * w + (b.alpha ?? 1) * (1 - w)),
    }
  }
  if (isRef(node.$value)) return resolveColorRef(node.$value, mode, brand)
  return node.$value
}

function resolveColorRef(ref, mode, brand) {
  const path = ref.slice(1, -1)
  const brandStep = path.match(/^color\.semantic\.brand\.(\d+)$/)
  if (brandStep) {
    return resolveColorNode(at(`color.semantic.brand-theme.${brand}.${brandStep[1]}`), mode, brand)
  }
  return resolveColorNode(forMode(at(path), mode), mode, brand)
}

// -------------------------------------------------------------- CSS values

const dimension = (value) =>
  isRef(value) ? `var(${cssVarName(value.slice(1, -1))})` : `${value.value}${value.unit}`

function cssValue(path, node) {
  const type = nodeType(path)
  const css = node.$extensions?.['com.cheddar.css']
  if (css) return css
  const value = node.$value
  if (isRef(value)) return `var(${cssVarName(value.slice(1, -1))})`

  switch (type) {
    case 'color':
      return rgbaString(value)
    case 'dimension':
      return dimension(value)
    case 'fontFamily':
      return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ')
    case 'typography': {
      const size = dimension(value.fontSize)
      const family = isRef(value.fontFamily)
        ? `var(${cssVarName(value.fontFamily.slice(1, -1))})`
        : value.fontFamily
      return `${value.fontWeight} ${size} / ${value.lineHeight} ${family}`
    }
    case 'shadow': {
      const layers = Array.isArray(value) ? value : [value]
      return layers
        .map((layer) => {
          const parts = [
            dimension(layer.offsetX),
            dimension(layer.offsetY),
            dimension(layer.blur),
          ]
          const spread = layer.spread
          const spreadCss = spread ? dimension(spread) : '0px'
          if (spreadCss !== '0px') parts.push(spreadCss)
          const color = isRef(layer.color)
            ? `var(${cssVarName(layer.color.slice(1, -1))})`
            : rgbaString(layer.color)
          return [...parts, color].join(' ')
        })
        .join(', ')
    }
    default:
      throw new Error(`unhandled $type "${type}" for "${path}"`)
  }
}

/** $type is inherited from the nearest ancestor that declares it. */
function nodeType(path) {
  const parts = path.split('.')
  for (let i = parts.length; i > 0; i--) {
    const node = at(parts.slice(0, i).join('.'))
    if (node?.$type) return node.$type
  }
  throw new Error(`no $type for "${path}"`)
}

// ---------------------------------------------------------------- CSS file

const SEMANTIC_GROUPS = [
  'foreground',
  'bg',
  'icon',
  'background',
  'border',
  'track',
  'shadow',
]

const isSemanticColor = (path) =>
  SEMANTIC_GROUPS.some((group) => path.startsWith(`color.semantic.${group}.`))
const isBrandTheme = (path) => path.startsWith('color.semantic.brand-theme.')
const isBrandRamp = (path) => /^color\.semantic\.brand\.\d+$/.test(path)
const isPrimitive = (path) =>
  path.startsWith('color.') && !path.startsWith('color.semantic.')

function declarations(entries, mode) {
  return entries
    .flatMap(([path, node]) => {
      const resolved = forMode(node, mode)
      const lines = [`\t${cssVarName(path)}: ${cssValue(path, resolved)};`]
      // The CSS `font:` shorthand cannot carry tracking, so a typography token
      // with letterSpacing also emits a companion var. Use sites that want the
      // full style pair `font:` with `letter-spacing:`.
      const tracking =
        nodeType(path) === 'typography' ? resolved.$value.letterSpacing : undefined
      if (tracking !== undefined) {
        lines.push(`\t${cssVarName(path)}-tracking: ${dimension(tracking)};`)
      }
      return lines
    })
    .join('\n')
}

/**
 * Elements that paint --cds-color-background-surface, and so are light islands
 * inside the branded shell. Keep in sync with the stylesheets; `npm run
 * tokens:check` cannot catch an omission, but a missing entry shows up
 * immediately as unreadable text on that component under `appearance="brand"`.
 *
 * Components that deliberately sit on the canvas — SectionHeader,
 * TotalSavingsCard, ProfileCard — are absent on purpose: they are transparent
 * or paint a brand fill, so the canvas pairing is already correct for them.
 *
 * Components fixed to one appearance are absent for the opposite reason; they
 * live in PINNED_LIGHT_SELECTORS, which covers the branded shell as well.
 */
const SURFACE_SELECTORS = [
  // components.css
  '.panel',
  '.textarea-input',
  '.search-field',
  // cards.css
  '.completed-goal-card',
  '.badge-card',
  // overlays.css
  '.sheet',
  // foundation.css (gallery chrome)
  '.app-shell',
  '.ds-theme-tile',
]

/**
 * The branded shell's canvas is dark while its surfaces stay white, so a surface
 * has to put back every token whose canvas value would be illegible on it —
 * foregrounds, icons, borders, tracks and the danger set. Emitting the light
 * values here means nested component rules keep using the ordinary tokens and
 * need no appearance-specific branches.
 *
 * `:where()` keeps this at zero specificity so a component rule still wins, and
 * scoping it to descendants means a surface nested in a surface is a no-op.
 */
function buildSurfaceScope() {
  const differs = modeEntries('brand').filter(([path, node]) => {
    const canvas = cssValue(path, forMode(node, 'brand'))
    return cssValue(path, forMode(node, 'light')) !== canvas
  })
  // background-surface itself must not be reset: the surface is what defines it.
  const entries = differs.filter(([path]) => path !== 'color.semantic.background.surface')
  const selector = SURFACE_SELECTORS.join(',\n')
  return `/* Surfaces inside the branded shell are light islands. See SURFACE_SELECTORS
 * in scripts/build-tokens.mjs. */
[data-appearance="brand"] :where(
${selector}
) {
\tcolor-scheme: light;

${declarations(entries, 'light')}
}`
}

/**
 * Components the design draws from primitives rather than semantic colour: a
 * white card with black text, whatever mode surrounds it. In Figma these carry
 * no mode variants at all, so a themed build was inventing a dark treatment the
 * design never specified.
 *
 * Only add a selector here when the design genuinely has one fixed appearance.
 * Anything that should follow the mode belongs in SURFACE_SELECTORS instead.
 */
const PINNED_LIGHT_SELECTORS = [
  // cards.css
  '.account-card',
  '.activity-card',
  // Every ArticleCard except the two that replace the white surface with a
  // brand fill — the large hero and the guide tile. Those keep the canvas
  // pairing; re-scoping them once resolved bg-brand-secondary to the canvas
  // colour and the card lost its container entirely (measured 1.00:1).
  //
  // Excluding the bare `-media`/`-flat` classes, as this once did, excluded
  // every card instead: the component always sets exactly one of the two, so
  // the entry silently matched nothing.
  '.article-card:not(.article-card-large.article-card-media, .article-card-small.article-card-flat)',
  // SpendingChartPanel, all three layouts. Descendants that paint the surface
  // again (the donut hole) inherit these from the panel.
  '.chart-panel',
  '.goal-card',
  '.goal-summary-card',
  '.savings-streak',
]

/**
 * Re-declares the light value of every token some mode would have changed, so
 * the subtree renders as if no mode were set. Unlike buildSurfaceScope this is
 * unscoped, and it does reset `background-surface`: dark mode redefines it, and
 * here the panel is what has to stay white.
 *
 * `:where()` keeps it at zero specificity, which is enough because the mode
 * layers match an ancestor — an inherited custom property loses to any
 * declaration that matches the element itself, whatever its specificity.
 */
function buildPinnedLightScope() {
  const entries = [...leaves(tokens)].filter(([path, node]) => {
    if (!isSemanticColor(path) && !path.startsWith('shadow.')) return false
    const light = cssValue(path, forMode(node, 'light'))
    return ['dark', 'brand'].some(
      (mode) =>
        node.$extensions?.['com.cheddar.mode']?.[mode] &&
        cssValue(path, forMode(node, mode)) !== light,
    )
  })
  const selector = PINNED_LIGHT_SELECTORS.join(',\n')
  return `/* Always-light components. See PINNED_LIGHT_SELECTORS in
 * scripts/build-tokens.mjs. */
:where(
${selector}
) {
\tcolor-scheme: light;

${declarations(entries, 'light')}
}`
}

/** Which tokens actually differ between the base and a mode. */
function modeEntries(mode) {
  return [...leaves(tokens)].filter(([path, node]) => {
    if (!isSemanticColor(path) && !path.startsWith('shadow.')) return false
    return Boolean(node.$extensions?.['com.cheddar.mode']?.[mode])
  })
}

function buildCss() {
  const all = [...leaves(tokens)]
  const pick = (predicate) => all.filter(([path]) => predicate(path))

  const banner = `/* Generated by scripts/build-tokens.mjs from tokens/cheddar.tokens.json.\n * Do not edit by hand — edit the JSON and run \`npm run tokens:build\`. */\n`

  const sections = []

  sections.push(`:root {
\t/* Primitives — Color. Web code syntax: --token-color-* */
${declarations(pick(isPrimitive), 'light')}

\t/* Sizes */
${declarations(pick((p) => p.startsWith('size.')), 'light')}

\t/* Font families */
${declarations(pick((p) => p.startsWith('font.family.')), 'light')}

\t/* Active brand ramp. Re-pointed by the [data-brand] layer below. */
${declarations(pick(isBrandRamp), 'light')}

\t/* Typography presets */
${declarations(pick((p) => p.startsWith('type.')), 'light')}
}`)

  sections.push(`/* Semantic colors — Light. Declared on :root (page default) AND on
 * [data-theme="light"] so a frame can flip back to light while nested inside a
 * dark ancestor, the way a Figma frame applies its own mode. */
:root,
[data-theme="light"] {
\tcolor-scheme: light;

${declarations(pick(isSemanticColor), 'light')}

${declarations(pick((p) => p.startsWith('shadow.')), 'light')}
}`)

  sections.push(`[data-theme="dark"] {
\tcolor-scheme: dark;

${declarations(modeEntries('dark'), 'dark')}
}`)

  sections.push(`/* Extended brand themes. Each re-points the semantic brand ramp to a
 * different primitive family; every brand-derived token follows.
 *   <html data-theme="dark" data-brand="blue"> */
${BRANDS.map((brand) => {
  const entries = [1, 2, 3, 4, 5, 6].map((i) => {
    const step = i * 100
    return `\t--cds-color-brand-${step}: var(${cssVarName(`color.${brand === 'magenta' ? 'brand' : brand}.${step}`)});`
  })
  return `[data-brand="${brand}"] {\n${entries.join('\n')}\n}`
}).join('\n\n')}`)

  sections.push(`/* Appearance — the product app shell.
 *
 * The Cheddar app screens in Figma are not "dark mode": they are a saturated
 * brand-100 canvas carrying light surfaces. Consumers previously approximated
 * this with data-theme="dark" plus their own background override, which broke
 * as soon as the brand ramp changed. data-appearance="brand" makes it a
 * first-class, brand-reactive appearance instead.
 *
 * This is the only appearance whose canvas and surfaces have opposite polarity:
 * the canvas is dark, the cards on it stay white. One foreground token cannot
 * serve both, so the values below are the *canvas* pairing, and the surface
 * layer that follows re-establishes the surface pairing for its subtree.
 *
 * Declared after the [data-theme] layers so it wins when both attributes sit
 * on the same element. A descendant that sets its own data-theme still resets
 * the full semantic set, which is how a light island lives inside the shell. */
[data-appearance="brand"] {
\tcolor-scheme: dark;

${declarations(modeEntries('brand'), 'brand')}
}

${buildSurfaceScope()}

/* Opt a subtree back out of the branded shell without picking a scheme. */
[data-appearance="surface"] {
\t--cds-color-background-default: var(--cds-color-background-surface);
}

${buildPinnedLightScope()}`)

  return `${banner}\n${sections.join('\n\n')}\n`
}

// ------------------------------------------------------- shared TS payloads

/** Semantic color tokens as [tsName, dottedPath] pairs, in stable order. */
const semanticColorEntries = [...leaves(tokens)]
  .filter(([path]) => isSemanticColor(path))
  .map(([path]) => [camel([path.slice('color.semantic.'.length)]), path])

const sizeEntries = [...leaves(tokens)]
  .filter(([path]) => path.startsWith('size.'))
  .map(([path, node]) => [camel([path.slice('size.'.length)]), node.$value.value])

function semanticTable(mode, brand) {
  return semanticColorEntries.map(([name, path]) => [
    name,
    rgbaString(resolveColor(path, mode, brand)),
  ])
}

const GENERATED_TS_BANNER = `// Generated by scripts/build-tokens.mjs from tokens/cheddar.tokens.json.
// Do not edit by hand — edit the JSON and run \`npm run tokens:build\`.
`

// ------------------------------------------------------------ React tokens

function buildReactTokens() {
  const cssVars = semanticColorEntries
    .map(([name, path]) => `  ${name}: 'var(${cssVarName(path)})',`)
    .join('\n')

  const brandRampVars = [1, 2, 3, 4, 5, 6]
    .map((i) => `  brand${i * 100}: 'var(--cds-color-brand-${i * 100})',`)
    .join('\n')

  const sizes = sizeEntries.map(([name, value]) => `  ${name}: ${value},`).join('\n')

  const typeVars = [...leaves(tokens)]
    .filter(([path]) => path.startsWith('type.'))
    .map(([path]) => `  ${camel([path.slice(5)])}: 'var(${cssVarName(path)})',`)
    .join('\n')

  const shadowVars = [...leaves(tokens)]
    .filter(([path]) => path.startsWith('shadow.'))
    .map(([path]) => `  ${camel([path.slice(7)])}: 'var(${cssVarName(path)})',`)
    .join('\n')

  const resolved = MODES.map(
    (mode) => `  ${mode}: {
${BRANDS.map(
  (brand) => `    ${brand}: {
${semanticTable(mode, brand)
  .map(([name, value]) => `      ${name}: '${value}',`)
  .join('\n')}
    },`,
).join('\n')}
  },`,
  ).join('\n')

  return `${GENERATED_TS_BANNER}
export type BrandTheme = ${BRANDS.map((b) => `'${b}'`).join(' | ')}
export type ColorScheme = 'light' | 'dark'
export type Appearance = 'surface' | 'brand'
/** The three token resolutions: light, dark, and the branded app shell. */
export type TokenMode = ${MODES.map((m) => `'${m}'`).join(' | ')}

/**
 * Semantic colors as CSS custom-property references. Prefer these in inline
 * styles so a value keeps following [data-theme] / [data-brand] /
 * [data-appearance] instead of freezing at render time.
 */
export const color = {
${cssVars}
${brandRampVars}
} as const

export const type = {
${typeVars}
} as const

export const shadow = {
${shadowVars}
} as const

/** Numeric sizing scale, in px. */
export const size = {
${sizes}
} as const

/**
 * Fully resolved color values for every mode x brand combination, with alpha
 * preserved. Use when a real color string is required — canvas, charts, meta
 * theme-color — and CSS variables cannot be used.
 */
export const resolvedColor = {
${resolved}
} as const

export type SemanticColorName = keyof typeof color

/** Resolve the semantic palette for a mode and brand. */
export function getResolvedColors(mode: TokenMode = 'light', brand: BrandTheme = 'magenta') {
  return resolvedColor[mode][brand]
}
`
}

// ------------------------------------------------------------------ emit

const outputs = [
  ['src/styles/tokens.css', buildCss()],
  ['src/tokens/tokens.ts', buildReactTokens()],
]

let stale = 0
for (const [file, contents] of outputs) {
  const path = resolve(root, file)
  let current = null
  try {
    current = readFileSync(path, 'utf8')
  } catch {
    /* not written yet */
  }
  if (current === contents) continue
  if (check) {
    stale += 1
    console.error(`stale: ${relative(root, path)}`)
    continue
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, contents)
  console.log(`wrote ${file}`)
}

if (check && stale > 0) {
  console.error(
    `\n${stale} token output(s) out of date. Run \`npm run tokens:build\` and commit the result.`,
  )
  process.exit(1)
}
if (check) console.log('token outputs up to date')
