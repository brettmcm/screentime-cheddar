# Cheddar Design System (cds)

React 19 + TypeScript + Vite component library for the Cheddar product, with Figma Code Connect wired up against the [Cheddar Product Design System](https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC) file.

## What's in this repo

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Dev gallery app — rendered by the Vite dev server for visual development |
| `src/index.ts` | Library entry point — all exported components and types |
| `src/components/` | React components |
| `src/styles/` | CSS source files (tokens, foundation, components) |
| `tokens/` | Raw design token JSON (`cheddar.tokens.json`) |
| `**/*.figma.ts` | Figma Code Connect mapping files |

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
| `npm run build` | Vite library build → type declarations (`tsc -p tsconfig.build.json`) → asset copy (CSS layers, fonts, tokens) into `dist/`. |
| `npm run preview` | Preview the last Vite production build locally. |
| `npm run lint` | Run ESLint across the repo. |
| `npm run figma:check-urls` | Verify every `.figma.ts` file points to a node that still exists in the Figma file. |
| `npm run figma:url-sync` | Refresh stale node URLs in `.figma.ts` files. |
| `npm run figma:publish` | Publish Code Connect mappings to the Figma file. Runs `figma:url-sync` first. |
| `npm run figma:publish:dry-run` | Same as above but no upload — useful for previewing the diff. |
| `npm run figma:unpublish` | Remove Code Connect mappings from the Figma file. |

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
| `dist/tokens/cheddar.tokens.json` | Raw design token JSON |

## Publishing

The package is currently configured to publish to the Figma private npm registry scoped to `@screentime`.

**Registry:** `https://registry.figma.com/npm/397d59b6-95ce-4b9e-8e24-db9b498f7374/registry/`

The scope mapping and auth token should be configured in each publisher's local user-level npm config (or in CI secrets). This repo intentionally gitignores `.npmrc` so credentials are not committed.

To publish a new version:

1. Bump the `version` field in `package.json`.
2. Ensure your local npm auth is configured for the target registry.
3. Run one of:
   - `npm run publish:figma` (Figma registry as `@screentime/cheddar-ds`)
   - `npm run publish:github` (GitHub Packages as `@figma/screentime-cheddar-ds`)
   - `npm run publish:both` (GitHub first, then Figma)

`prepublishOnly` runs `npm run build` automatically before the upload, so there is no separate build step required.

Recommended preflight before any publish:

```sh
npm run release:check
```

**Note:** Do not publish with `--dry-run` to verify the tarball contents; use `npm pack` instead to inspect what would be uploaded without touching the registry.

## Installing as a consumer

```sh
npm install @screentime/cheddar-ds
```

Peer dependencies: `react@^19.0.0`, `react-dom@^19.0.0`.

Import the all-in-one stylesheet once at your app entry point — it is required for components to render correctly:

```ts
import '@screentime/cheddar-ds/styles.css'
```

Types ship with the package (`dist/index.d.ts`) — no separate `@types/*` install needed.

**Outside Figma Make** you will need the `@screentime` scope entry in your project's npm config pointing to the Figma registry. In Figma Make the registry is preconfigured and no project-level npm config is required.