# Cheddar Design System (cds)

React 19 + TypeScript + Vite component library for the Cheddar product, with Figma Code Connect wired up against the [Cheddar Product Design System](https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC) file.

## What's in this repo

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Dev gallery app — rendered by the Vite dev server for visual development |
| `src/index.ts` | Library entry point — all exported components and types |
| `src/components/` | React components |
| `src/styles/` | CSS source files (`tokens.css` is **generated** — see Tokens below) |
| `src/tokens/` | Generated typed token accessors for React consumers |
| `src/demo-assets/` | Typed manifest for the bundled demo imagery |
| `tokens/cheddar.tokens.json` | **Source of truth** for every design token (DTCG) |
| `platforms/` | Generated Swift token output |
| `docs/` | Parity audit and migration notes |
| `tests/visual/` | Playwright screenshot suite — **local-only**, not committed (see below) |
| `**/*.figma.ts` | Figma Code Connect mapping files |

## Components

Every component is exported from the package root along with its props type
(`import { GoalCard, type GoalCardProps } from '@screentime/cheddar-ds'`).

| Group | Exports |
| --- | --- |
| Actions | `Button`, `IconButton`, `TextLink` |
| Forms | `InputField`, `Textarea`, `Search`, `Checkbox`, `Radio`, `SwitchField`, `Slider`, `NumberPad` |
| Navigation & chrome | `Nav`, `PageHeader`, `Sheet`, `SectionHeader` |
| Content | `ActivityItem`, `Avatar`, `Tag`, `Toast`, `Notification`, `EmptyState`, `Icon`, `Logo`, `Wordmark` |
| Cards & panels | `TotalSavingsCard`, `GoalCard`, `CompletedGoalCard`, `ArticleCard`, `ActivityCard`, `ProfileCard`, `BadgeCard`, `AccountCard`, `GoalSummaryCard`, `SpendingChartPanel`, `SavingsStreak` |
| Theming | `ThemeScope` |

The catch-all `Card`, which rendered hardcoded demo content selected by `variant`, was removed
in v1.2.2. Use the card component matching your shape; see
[`docs/migration-1.2.md`](docs/migration-1.2.md) for the variant-to-component table.

Demo imagery for the cards lives behind its own subpath so the artwork stays out of the main
entry point:

```ts
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
// demoAssets.goals.headphones, demoAssets.articles.piggyBank, demoAssets.celebration.goalReached
```

Further reading: [`docs/figma-parity-audit.md`](docs/figma-parity-audit.md) records how the
library maps onto the Figma file and where the two had drifted.

## Getting started

```sh
npm install
cp .env.example .env.local   # then fill in FIGMA_ACCESS_TOKEN
npm run dev
```

Open the dev server URL printed in the terminal to see the component gallery.

## Environment

This repo reads secrets from `.env.local` (gitignored). See [.env.example](.env.example) for the full list.

| Variable | Required for | How to obtain |
| --- | --- | --- |
| `FIGMA_ACCESS_TOKEN` | `npm run figma:*` (Code Connect publish, URL sync) | [Figma → Settings → Personal access tokens](https://www.figma.com/settings). Scopes: **File content (read)** + **Code Connect (write)**. |

`npm run dev`, `npm run build`, and `npm run lint` do **not** require any env vars.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with the component gallery. |
| `npm run build` | Token generation → Vite library build → type declarations (`tsc -p tsconfig.build.json`) → asset copy (CSS layers, fonts, tokens, platform outputs) into `dist/`. |
| `npm run preview` | Preview the last Vite production build locally. |
| `npm run lint` | Run ESLint across the repo. |
| `npm run typecheck` | Type-check all three TS projects without emitting: library source, build scripts, and the Code Connect templates. |
| `npm run tokens:build` | Regenerate every platform's tokens from `tokens/cheddar.tokens.json`. |
| `npm run tokens:check` | Fail if any generated token output is stale (CI guard). |
| `npm run assets:check` | Fail if the demo-asset manifest references a file that is missing or empty. |
| `npm run test` | Interaction + accessibility tests (Vitest, jsdom). |
| `npm run test:a11y` | Accessibility tests only (axe-core). |
| `npm run test:visual` | Screenshot tests against the gallery (Playwright + Chromium). Local-only — see below. |
| `npm run test:visual:update` | Re-record screenshot baselines. |
| `npm run verify` | `tokens:check` + `assets:check` + `lint` + `typecheck` + `test`. |
| `npm run release:check` | `verify` + `build` + Code Connect validation + `npm pack --dry-run`. Run this before tagging. |
| `npm run figma:check-urls` | Verify every `.figma.ts` URL points at the file in `figma.config.json`. Node IDs are validated by `figma:publish:dry-run`, which resolves them against the live file. |
| `npm run figma:url-sync` | Refresh stale node URLs in `.figma.ts` files. |
| `npm run figma:publish` | Publish Code Connect mappings to the Figma file. Runs `figma:url-sync` first. |
| `npm run figma:publish:dry-run` | Same as above but no upload — useful for previewing the diff. |
| `npm run figma:unpublish` | Remove Code Connect mappings from the Figma file. |

### Visual tests are local-only

`tests/` is gitignored, so neither the specs nor their screenshot baselines are in
the repo. The tests that travel with a clone are the Vitest unit and accessibility
suites under `src/`, which `npm run verify` covers.

The consequence is worth stating plainly: because Playwright records a baseline the
first time it sees a screenshot name, a freshly generated set always passes. The
suite therefore catches changes you make within one local session, not regressions
introduced by someone else. Treat it as a development aid rather than a guard.

## Build output

`npm run build` produces the following in `dist/`:

| Output | Description |
| --- | --- |
| `dist/index.js` | ESM component bundle (tree-shakeable) |
| `dist/index.d.ts` | TypeScript declarations |
| `dist/styles/index.css` | All-in-one stylesheet — imports fonts → tokens → foundation → components in order |
| `dist/styles/fonts.css` | `@font-face` declarations for Mona Sans + Oswald |
| `dist/styles/tokens.css` | CSS custom properties (design tokens) |
| `dist/styles/foundation.css` | Layout helpers (`.app-shell`, `.ds-page`, etc.) |
| `dist/styles/components.css` | All component class definitions |
| `dist/fonts/` | Self-contained `.woff2` files — no `@fontsource` dep needed at consumer end |
| `dist/tokens/cheddar.tokens.json` | The authoritative DTCG token document |
| `dist/tokens/tokens.js` + `.d.ts` | Typed token accessors (`@screentime/cheddar-ds/tokens`) |
| `dist/demo-assets.js` | Demo imagery manifest (`@screentime/cheddar-ds/demo-assets`) |
| `dist/assets/` | Fingerprinted demo images referenced by the manifest |
| `dist/platforms/swift/CheddarTokens.swift` | Generated SwiftUI tokens |

## Tokens

`tokens/cheddar.tokens.json` is the **single source of truth** (DTCG 2025.10). Everything else is generated
from it by `scripts/build-tokens.mjs`:

```
tokens/cheddar.tokens.json
        ├── src/styles/tokens.css                  web / React
        ├── src/tokens/tokens.ts                   typed accessors
        └── platforms/swift/CheddarTokens.swift     SwiftUI
```

Never hand-edit a generated file — change the JSON and run `npm run tokens:build`. `npm run tokens:check`
fails the build if an output has drifted.

Semantic tokens carry their per-mode values in `$extensions["com.cheddar.mode"]` (`dark` and `brand`), and
alpha is preserved end-to-end: as `rgba()` in CSS and as `opacity` on `CheddarColor` in Swift. Tokens that
are brand-derived tints declare a `com.cheddar.mix` recipe so every platform stays reactive to the
selected brand instead of freezing a magenta value.

## Theming

Theming is three independent, nestable axes, applied as data attributes by `ThemeScope`:

| Axis | Attribute | Values |
| --- | --- | --- |
| Colour scheme | `data-theme` | `light`, `dark` |
| Brand ramp | `data-brand` | `magenta`, `blue`, `green`, `purple` |
| Appearance | `data-appearance` | `surface`, `brand` |

`appearance="brand"` is the **product app shell**: a saturated `--cds-color-brand-100` canvas carrying light
surfaces, matching the Cheddar app screens in Figma. It is not the same thing as dark mode — reach for it
instead of `scheme="dark"` when you want the branded chrome.

```tsx
import { ThemeScope } from '@screentime/cheddar-ds'

<ThemeScope brand="blue" appearance="brand">
  {/* branded blue app shell */}
  <ThemeScope scheme="light">{/* a light island inside it */}</ThemeScope>
</ThemeScope>
```

Because each layer only redefines CSS custom properties, scopes nest arbitrarily and a descendant always
wins over its ancestor.

## Publishing / distribution

The DS reaches consumers through two channels, both under the package name `@screentime/cheddar-ds`:

| Channel | Consumer | How it's distributed |
| --- | --- | --- |
| Figma registry - *Figma Advocates instance* -  | Figma Make | `npm run publish:figma` (published versions) |
| Git (`git+ssh`) | App code outside Make | Consumers install directly from a git tag — no registry publish |

> **Why not GitHub Packages?** The `figma` org blocks classic personal access tokens and GitHub Packages' npm registry does not support fine-grained tokens, so the app code is consumed straight from git over SSH.

### Figma registry (`@screentime`)

Credentials live in the publisher's `.npmrc` (this repo gitignores `.npmrc`, so tokens are never committed):

```
@screentime:registry=https://registry.figma.com/npm/397d59b6-95ce-4b9e-8e24-db9b498f7374/registry/
//registry.figma.com/npm/397d59b6-95ce-4b9e-8e24-db9b498f7374/registry/:_authToken=<figma-token>
```

To release: bump `version` in `package.json`, confirm auth, then run `npm run publish:figma`. The build runs automatically via the `prepublishOnly` hook.

### Git distribution (app code)

There is no upload step — consumers install from a git ref and the `prepare` script builds `dist/` on install. To cut a release:

1. Bump the `version` field in `package.json` and merge to the default branch.
2. Tag the commit so apps can pin to it:

```sh
git tag v1.2.2
git push origin v1.2.2
```

Recommended preflight before any release:

```sh
npm run release:check
```

**Note:** Use `npm pack` to inspect what would be shipped; do not rely on `--dry-run` publishes.

## Installing as a consumer

Both channels install under the name `@screentime/cheddar-ds`; only the dependency source differs.

### Option A — Git install (`git+ssh`, for app code)

Add the DS to your app's `package.json`, pinned to a tag (or branch/commit):

```json
{
  "dependencies": {
    "@screentime/cheddar-ds": "git+ssh://git@github.com/figma/screentime-cheddar-ds.git#v1.2.2"
  }
}
```

Then run `npm install`. npm clones the repo over SSH, runs the `prepare` script to build `dist/`, and packs it — so `dist/` does not need to be committed. This relies only on your existing SSH access to the repo; no registry token is required. CI runners must also have an SSH key (or git token) with read access to the repo.

To update, bump the tag/ref in your app's `package.json` and reinstall.

npm also accepts a range here — `…screentime-cheddar-ds.git#semver:^1.2.2` resolves against the repo's tags — but an explicit tag is the documented form on purpose. This package's version numbers do not strictly track semver: `1.2.2` removed public exports, and a caret range would have delivered that as an automatic upgrade. Pinning keeps every DS bump a visible, reviewable line in the consuming app's diff. Either form records the resolved commit in `package-lock.json`, so committed lockfiles install identically; the range only drifts when the lockfile is regenerated.

### Option B — Figma registry (`@screentime`, for Figma Make)

Add the dependency to your Make project's `package.json` and Make resolves it against its preconfigured registry — no `.npmrc` or scope mapping needed:

```json
{
  "dependencies": {
    "@screentime/cheddar-ds": "^1.2.2"
  }
}
```

This channel is for Figma Make only. For app code outside Make, use Option A.

### Usage (both channels)

Peer dependencies: `react@^19.0.0`, `react-dom@^19.0.0`.

Import the all-in-one stylesheet once at your app entry point — it is required for components to render correctly:

```ts
import '@screentime/cheddar-ds/styles.css'
```

Types ship with the package (`dist/index.d.ts`) — no separate `@types/*` install needed. Ensure your app's TypeScript `moduleResolution` is `bundler`, `node16`, or `nodenext` so the package's `exports` map and type declarations resolve correctly.