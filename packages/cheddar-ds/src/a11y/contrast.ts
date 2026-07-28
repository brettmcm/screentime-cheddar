const checks = [
  { fg: '#000000', bg: '#ffffff', label: 'foreground primary on surface' },
  { fg: '#850056', bg: '#ffffff', label: 'brand text on surface' },
  { fg: '#ffffff', bg: '#850056', label: 'on brand primary' },
  { fg: '#64002d', bg: '#ffebfd', label: 'reverse brand text' },
  { fg: '#666666', bg: '#ffffff', label: 'secondary text on surface' },
]

function srgbToLinear(value: number) {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrastRatio(foreground: string, background: string) {
  const l1 = luminance(foreground)
  const l2 = luminance(background)
  const light = Math.max(l1, l2)
  const dark = Math.min(l1, l2)
  return (light + 0.05) / (dark + 0.05)
}

export function runA11yTokenChecks() {
  const failures = checks.filter((check) => contrastRatio(check.fg, check.bg) < 4.5)
  if (failures.length > 0) {
    console.error(`WCAG AA color contrast checks failed: ${failures.map((f) => f.label).join(', ')}`)
  }
}
