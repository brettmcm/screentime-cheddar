/**
 * Ports the design system's icon set to Swift.
 *
 * iOS had no equivalent of the DS `Icon`, so screens reached for SF Symbols and
 * drifted from the design (a paper plane where the design wanted `send`, and so
 * on). Rather than hand-copying glyphs, this renders every icon through the
 * DS's own React component and converts the emitted path data into SwiftUI
 * `Path` segments, so the two platforms cannot disagree about what an icon is.
 *
 * The SVG parsing lives here rather than in Swift on purpose: the generator can
 * fail loudly on a command it doesn't understand, whereas a runtime parser on
 * device would have to guess.
 */
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Icon } from '@screentime/cheddar-ds'
import { readFileSync, writeFileSync } from 'node:fs'

const ICON_DTS = 'node_modules/@screentime/cheddar-ds/dist/components/icon/Icon.d.ts'
const OUT = 'apps/ios/Packages/CheddarDS/Sources/CheddarDS/Theme/Generated/CheddarIcons.swift'

/** Every command the DS icons actually use. Anything else should stop the build. */
const SUPPORTED = new Set(['M', 'L', 'H', 'V', 'C', 'Z'])

const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g

function tokenize(d) {
  const tokens = []
  let index = 0
  while (index < d.length) {
    const char = d[index]
    if (/[a-zA-Z]/.test(char)) {
      tokens.push({ command: char })
      index++
      continue
    }
    if (/[\s,]/.test(char)) {
      index++
      continue
    }
    NUMBER.lastIndex = index
    const match = NUMBER.exec(d)
    if (!match || match.index !== index) throw new Error(`bad number at ${index} in ${d}`)
    tokens.push({ number: Number(match[0]) })
    index += match[0].length
  }
  return tokens
}

/**
 * Flattens a path into absolute move/line/curve/close segments. Handles the
 * implicit-repeat form (`C a b c d e f g h i ...`) and the implicit lineto that
 * follows a moveto, both of which Figma's exporter emits.
 */
function parsePath(d) {
  const tokens = tokenize(d)
  const segments = []
  let cursor = 0
  let command = null
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0

  const take = (count) => {
    const values = []
    for (let i = 0; i < count; i++) {
      const token = tokens[cursor++]
      if (!token || token.number === undefined) throw new Error(`expected number in ${d}`)
      values.push(token.number)
    }
    return values
  }

  while (cursor < tokens.length) {
    if (tokens[cursor].command !== undefined) {
      command = tokens[cursor].command
      cursor++
      if (!SUPPORTED.has(command.toUpperCase())) {
        throw new Error(`unsupported path command "${command}"`)
      }
      // A repeated moveto degrades to lineto for every pair after the first.
    } else if (command === 'M') {
      command = 'L'
    } else if (command === 'm') {
      command = 'l'
    }

    const relative = command === command.toLowerCase()
    const dx = relative ? x : 0
    const dy = relative ? y : 0

    switch (command.toUpperCase()) {
      case 'M': {
        const [px, py] = take(2)
        x = px + dx
        y = py + dy
        startX = x
        startY = y
        segments.push(['move', x, y])
        break
      }
      case 'L': {
        const [px, py] = take(2)
        x = px + dx
        y = py + dy
        segments.push(['line', x, y])
        break
      }
      case 'H': {
        const [px] = take(1)
        x = px + dx
        segments.push(['line', x, y])
        break
      }
      case 'V': {
        const [py] = take(1)
        y = py + dy
        segments.push(['line', x, y])
        break
      }
      case 'C': {
        const [x1, y1, x2, y2, px, py] = take(6)
        segments.push(['curve', x1 + dx, y1 + dy, x2 + dx, y2 + dy, px + dx, py + dy])
        x = px + dx
        y = py + dy
        break
      }
      case 'Z': {
        x = startX
        y = startY
        segments.push(['close'])
        break
      }
    }
  }
  return segments
}

const dts = readFileSync(ICON_DTS, 'utf8')
const names = [...dts.match(/export type IconName = ([^;]+);/)[1].matchAll(/'([^']+)'/g)].map(
  (m) => m[1],
)

const round = (value) => Number(value.toFixed(5))

const icons = names.map((name) => {
  // The mono rendering is what distinguishes the two fill roles: the DS paints
  // the primary shape in `currentColor` and knocks the secondary one out.
  const html = renderToStaticMarkup(createElement(Icon, { name, tone: 'mono' }))
  const viewBox = html.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  const [minX, minY, width, height] = viewBox
  if (minX !== 0 || minY !== 0) throw new Error(`${name}: expected a zero-origin viewBox`)

  const paths = [...html.matchAll(/<path\b([^>]*)>/g)].map(([, attrs]) => {
    const attr = (key) => (attrs.match(new RegExp(`${key}="([^"]*)"`)) || [])[1]
    const d = attr('d')
    const fill = attr('fill')
    const stroke = attr('stroke')

    // A few glyphs (the carets, check, heart-outline) are drawn as strokes
    // rather than filled outlines, so they need a different Swift draw call.
    const stroked = stroke && stroke !== 'none'
    if (stroked && fill !== 'none') throw new Error(`${name}: path is both filled and stroked`)

    const paint = stroked ? stroke : fill
    if (paint !== 'currentColor' && !paint.startsWith('var(--cds-icon-knockout')) {
      throw new Error(`${name}: unexpected paint "${paint}"`)
    }
    const role = paint === 'currentColor' ? 'primary' : 'secondary'

    let style
    if (stroked) {
      for (const key of ['stroke-linecap', 'stroke-linejoin']) {
        const value = attr(key)
        if (value !== undefined && value !== 'round') {
          throw new Error(`${name}: unsupported ${key} "${value}"`)
        }
      }
      style = `.stroke(width: ${round(Number(attr('stroke-width')) / width)})`
    } else {
      const rule = attr('fill-rule')
      if (rule !== undefined && rule !== 'evenodd' && rule !== 'nonzero') {
        throw new Error(`${name}: unsupported fill-rule "${rule}"`)
      }
      const opacity = attr('fill-opacity') === undefined ? 1 : Number(attr('fill-opacity'))
      style = `.fill(evenOdd: ${rule === 'evenodd'}, opacity: ${opacity})`
    }

    // Normalise to a unit square so Swift can draw the glyph at any size, and
    // so the handful of 23.9993-style viewBoxes stop mattering.
    const segments = parsePath(d).map(([kind, ...coords]) => [
      kind,
      ...coords.map((value, index) => round(value / (index % 2 === 0 ? width : height))),
    ])
    return { role, style, segments }
  })
  return { name, paths }
})

const swiftCase = (name) =>
  name.replace(/-([a-z])/g, (_, char) => char.toUpperCase())

const lines = []
lines.push('// Generated by scripts/generate-ios-icons.mjs — do not edit by hand.')
lines.push('// Source: @screentime/cheddar-ds `Icon`. Run `npm run codegen` to refresh.')
lines.push('')
lines.push('import SwiftUI')
lines.push('')
lines.push('public enum CheddarIconName: String, CaseIterable, Sendable {')
for (const { name } of icons) lines.push(`    case ${swiftCase(name)} = "${name}"`)
lines.push('}')
lines.push('')
lines.push('/// One drawing instruction in a glyph, in unit-square coordinates.')
lines.push('public enum CheddarIconSegment: Sendable {')
lines.push('    case move(CGFloat, CGFloat)')
lines.push('    case line(CGFloat, CGFloat)')
lines.push('    case curve(CGFloat, CGFloat, CGFloat, CGFloat, CGFloat, CGFloat)')
lines.push('    case close')
lines.push('}')
lines.push('')
lines.push('/// `secondary` is the knocked-out shape the DS paints in the surface colour.')
lines.push('public enum CheddarIconRole: Sendable {')
lines.push('    case primary')
lines.push('    case secondary')
lines.push('}')
lines.push('')
lines.push('/// Most glyphs are filled outlines; the carets, check and heart-outline are')
lines.push('/// drawn as round-capped strokes, with the width in unit-square terms.')
lines.push('public enum CheddarIconStyle: Sendable {')
lines.push('    case fill(evenOdd: Bool, opacity: Double)')
lines.push('    case stroke(width: CGFloat)')
lines.push('}')
lines.push('')
lines.push('public struct CheddarIconPath: Sendable {')
lines.push('    public let role: CheddarIconRole')
lines.push('    public let style: CheddarIconStyle')
lines.push('    public let segments: [CheddarIconSegment]')
lines.push('}')
lines.push('')
lines.push('public enum CheddarIcons {')
lines.push('    public static func paths(for name: CheddarIconName) -> [CheddarIconPath] {')
lines.push('        switch name {')
for (const { name, paths } of icons) {
  lines.push(`        case .${swiftCase(name)}:`)
  lines.push('            return [')
  for (const { role, style, segments } of paths) {
    lines.push(`                CheddarIconPath(role: .${role}, style: ${style}, segments: [`)
    for (const [kind, ...coords] of segments) {
      lines.push(
        kind === 'close'
          ? '                    .close,'
          : `                    .${kind}(${coords.join(', ')}),`,
      )
    }
    lines.push('                ]),')
  }
  lines.push('            ]')
}
lines.push('        }')
lines.push('    }')
lines.push('}')
lines.push('')

writeFileSync(OUT, lines.join('\n'))
console.log(
  `Wrote ${OUT} — ${icons.length} icons, ${icons.reduce((sum, i) => sum + i.paths.length, 0)} paths.`,
)
