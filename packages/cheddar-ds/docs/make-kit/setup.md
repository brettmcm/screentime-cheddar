# Setup

## Dependency

```json
{
  "dependencies": {
    "@screentime/cheddar-ds": "^1.2.3"
  }
}
```

**1.2.3 is the minimum usable version.** Earlier versions baked root-absolute asset URLs
(`/assets/headphones-….png`) into the bundle, so every bundled image — the demo artwork and
the `Avatar` fallbacks — 404s in any consumer that does not happen to serve the package's own
`dist` from its web root.

Peer dependencies are `react@^19` and `react-dom@^19`. Types ship with the package, so no
`@types/*` install is needed.

## The one required step

Import the all-in-one stylesheet once at the app entry point. The JS bundle does not import
CSS, so without this line every component renders as unstyled markup:

```tsx
// main.tsx
import '@screentime/cheddar-ds/styles.css'
```

That is the entire setup. There is no provider component to mount, no context, no theme
object to pass, and no build configuration to add.

The first thing to render inside it is the themed shell,
`<ThemeScope appearance="brand" className="cds-app-canvas">` — see `styles.md`. The
stylesheet alone paints no page background.

## What not to do

- **Do not add fonts.** Mona Sans Variable and Oswald ship as `.woff2` inside the package
  and the stylesheet declares them. No Google Fonts link, no `@fontsource` install, no
  `font-family` declarations.
- **Do not add a CSS reset or normalize on top.** The stylesheet brings what the components
  need.
- **Do not import the individual layers** (`fonts.css`, `tokens.css`, `foundation.css`,
  `components.css`) unless you have a specific reason — `styles.css` imports all four in the
  correct order.

## Imports

Everything you normally need comes from the package root, props types included:

```tsx
import { GoalCard, ThemeScope, type GoalCardProps } from '@screentime/cheddar-ds'
```

Other entry points:

| Subpath | Contents |
| --- | --- |
| `@screentime/cheddar-ds/styles.css` | The stylesheet (required) |
| `@screentime/cheddar-ds/demo-assets` | Typed demo imagery manifest — use this for images |
| `@screentime/cheddar-ds/tokens` | Typed token accessors for inline styles |
| `@screentime/cheddar-ds/tokens.json` | The DTCG token document |

## Browser support

Theme-sensitive colors are `color-mix()` expressions over the active brand ramp, so the
components need Safari 16.2+, Chrome 111+, or Firefox 113+.
