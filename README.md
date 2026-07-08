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
git tag v1.0.1
git push origin v1.0.1
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
    "@screentime/cheddar-ds": "git+ssh://git@github.com/figma/screentime-cheddar-ds.git#v1.0.1"
  }
}
```

Then run `npm install`. npm clones the repo over SSH, runs the `prepare` script to build `dist/`, and packs it — so `dist/` does not need to be committed. This relies only on your existing SSH access to the repo; no registry token is required. CI runners must also have an SSH key (or git token) with read access to the repo.

To update, bump the tag/ref in your app's `package.json` and reinstall.

### Option B — Figma registry (`@screentime`, for Figma Make)

Add the dependency to your Make project's `package.json` and Make resolves it against its preconfigured registry — no `.npmrc` or scope mapping needed:

```json
{
  "dependencies": {
    "@screentime/cheddar-ds": "^1.0.1"
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