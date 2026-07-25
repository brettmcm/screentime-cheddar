# cheddar-tokens

Platform-neutral design tokens for Cheddar apps. Source of truth is `@screentime/cheddar-ds` (`dist/tokens/cheddar.tokens.json`).

## Codegen

From repo root:

```sh
npm run codegen
```

This syncs JSON from the npm DS, then:

- vendors the DS's own `dist/platforms/swift/CheddarTokens.swift` into
  `apps/ios/.../Theme/Generated/CheddarTokens.swift` (primitives, sizes, typography, and
  the light/dark/brand semantic palettes)
- regenerates `packages/cheddar-tokens/generated/tokens.ts` (TypeScript tooling and web consumers)

Swift is no longer generated locally. The DS export is authoritative because it also carries
typography and the dark/brand appearances that live in the tokens' `$extensions` — which the
local generator never read.

Known gap in the upstream export: `CheddarTokens.ramp(_:)` returns the magenta ramp for every
brand. Read brand ramps from `CheddarPrimitives` and semantic colors from
`CheddarTokens.semantic(appearance:brand:)`, which are correct.

iOS fonts are converted from DS woff2 → TTF via `scripts/sync-ios-fonts.mjs` (requires `pip install -r scripts/requirements-fonts.txt`).
