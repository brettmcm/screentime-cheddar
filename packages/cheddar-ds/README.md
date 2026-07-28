# Cheddar Design System

Private React 19 design system for the Cheddar web app. It lives in the
`screentime-cheddar` npm workspace and is consumed from source under the package
name `@screentime/cheddar-ds`.

## Contents

| Path | Purpose |
| --- | --- |
| `src/components/` | React components and component tests. |
| `src/styles/` | Font, token, foundation, and component CSS. |
| `src/demo-assets/` | Typed manifest for bundled demo imagery. |
| `tokens/cheddar.tokens.json` | Canonical DTCG token source. |
| `src/tokens/` | Generated typed token accessors. |
| `src/gallery/` | Visual development gallery. |
| `**/*.figma.ts` | Code Connect mappings. |

## Internal API

The workspace preserves these import paths:

```ts
import { Button, GoalCard, ThemeScope } from '@screentime/cheddar-ds'
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { color, size, type } from '@screentime/cheddar-ds/tokens'
import '@screentime/cheddar-ds/styles.css'
```

The package is private. It is not published to an npm registry and is not
supported as a git-installed dependency.

## Components

| Group | Exports |
| --- | --- |
| Actions | `Button`, `IconButton`, `TextLink` |
| Forms | `InputField`, `Textarea`, `Search`, `Checkbox`, `Radio`, `SwitchField`, `Slider`, `NumberPad` |
| Navigation | `Nav`, `PageHeader`, `Sheet`, `SectionHeader` |
| Content | `ActivityItem`, `Avatar`, `Tag`, `Toast`, `Notification`, `EmptyState`, `Icon`, `Logo`, `Wordmark` |
| Cards | `TotalSavingsCard`, `GoalCard`, `CompletedGoalCard`, `ArticleCard`, `ActivityCard`, `ProfileCard`, `BadgeCard`, `AccountCard`, `GoalSummaryCard`, `SpendingChartPanel`, `SavingsStreak` |
| Theming | `ThemeScope` |

## Tokens and styles

`tokens/cheddar.tokens.json` is the single token source of truth. Generation
produces the web outputs:

```text
tokens/cheddar.tokens.json
├── src/styles/tokens.css
└── src/tokens/tokens.ts
```

Run `npm run tokens:build` from the monorepo root after changing the JSON.
Generated files should not be edited by hand.

The all-in-one stylesheet loads the bundled Mona Sans and Oswald faces before
tokens, foundations, and component layers. Demo image imports are ordinary
source imports, so the consuming Vite app fingerprints and emits them itself.

## Theming

`ThemeScope` controls three independent attributes:

| Axis | Attribute | Values |
| --- | --- | --- |
| Color scheme | `data-theme` | `light`, `dark` |
| Brand ramp | `data-brand` | `magenta`, `blue`, `green`, `purple` |
| Appearance | `data-appearance` | `surface`, `brand` |

`appearance="brand"` is the product shell, not dark mode. Add
`cds-app-canvas` when a scope should paint its own canvas, or paint it with the
semantic background and foreground tokens.

## Development and verification

From the monorepo root:

```sh
npm run dev:ds
npm run build
npm run verify
```

The design-system build remains an independent bundling and declaration check;
the product app consumes the source workspace rather than `dist`.

## Code Connect

Mappings target the Cheddar Product Design System configured in
`figma.config.json`. Copy `.env.example` to `.env.local` and set
`FIGMA_ACCESS_TOKEN`.

```sh
npm run figma:check-urls
npm run figma:url-sync
npm run figma:publish:dry-run
```

Publishing and unpublishing are explicit operations and are not part of normal
builds or verification.
