# Cheddar

Cheddar is a web monorepo containing the product app and its design system. The
app consumes the design system directly from this repository; there is no git,
registry, or published-package dependency between them.

## Repository layout

| Path | Purpose |
| --- | --- |
| `apps/web/` | Mobile-optimized React product app. |
| `packages/cheddar-ds/` | Private React design system, gallery, tokens, assets, tests, and Code Connect mappings. |

Both directories are npm workspaces. Install once at the repository root:

```sh
npm ci
```

## Development

```sh
npm run dev       # product app
npm run dev:ds    # design-system gallery
```

The design system exports TypeScript and CSS source to the app, so component,
token, style, font, and demo-asset changes are picked up without publishing or
reinstalling a package.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the design system and the production web app. |
| `npm run verify` | Run token and asset guards, lint, typechecking, unit tests, and the web build. |
| `npm test` | Run both workspaces' unit and accessibility tests. |
| `npm run test:visual` | Run the committed web Playwright screenshots, accessibility, and browser checks. |
| `npm run tokens:build` | Regenerate CSS and typed token accessors from the DTCG source. |
| `npm run figma:check-urls` | Check Code Connect URLs without changing them. |

## Design-system boundary

App code keeps the stable package-shaped imports:

```ts
import { Button } from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { color } from '@screentime/cheddar-ds/tokens'
import '@screentime/cheddar-ds/styles.css'
```

`@screentime/cheddar-ds` is private and supported only inside this monorepo. Its
package name remains useful as an architectural boundary and as the import shown
by Code Connect.

## Code Connect

Copy the design-system environment template, add a Figma token, and run the
commands from the repository root:

```sh
cp packages/cheddar-ds/.env.example packages/cheddar-ds/.env.local
npm run figma:check-urls
npm run figma:publish:dry-run
```

`figma:publish` and `figma:unpublish` change the connected Figma file. They are
kept as explicit commands and are never part of `build` or `verify`.

## History

This repository retains the complete histories of the former app and design
system repositories. Former design-system releases are namespaced as
`cheddar-ds/v*` so they cannot be mistaken for monorepo releases.
