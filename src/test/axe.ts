import axe, { type AxeResults, type ElementContext, type RunOptions } from 'axe-core'

/**
 * The rules worth enforcing on an isolated component render. Colour contrast is
 * excluded because jsdom does not compute cascaded custom properties, so every
 * token-driven colour resolves to transparent and the rule is meaningless here —
 * contrast is covered by src/a11y/contrast.ts and the Playwright suite instead.
 */
const DEFAULT_OPTIONS: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
  rules: {
    'color-contrast': { enabled: false },
    // A bare component render has no landmark structure by design.
    region: { enabled: false },
  },
}

export async function runAxe(
  context: ElementContext,
  options: RunOptions = {},
): Promise<AxeResults> {
  return axe.run(context, { ...DEFAULT_OPTIONS, ...options })
}

function formatViolations(results: AxeResults): string {
  return results.violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `      ${node.html}\n        ${node.failureSummary ?? ''}`)
        .join('\n')
      return `  [${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}`
    })
    .join('\n\n')
}

export async function toHaveNoAxeViolations(received: ElementContext, options?: RunOptions) {
  const results = await runAxe(received, options)
  return {
    pass: results.violations.length === 0,
    message: () =>
      results.violations.length === 0
        ? 'expected accessibility violations, found none'
        : `expected no accessibility violations, found ${results.violations.length}:\n\n${formatViolations(results)}`,
  }
}

declare module 'vitest' {
  // The parameter list has to match Vitest's own `Matchers<T = any>` exactly,
  // hence the `any` — narrowing it to `unknown` is a redeclaration conflict.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> {
    toHaveNoAxeViolations(options?: RunOptions): Promise<T>
  }
}
