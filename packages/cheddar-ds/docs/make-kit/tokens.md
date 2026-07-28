# Tokens

All tokens are CSS custom properties, available anywhere once the stylesheet is imported.

**Values already carry their units.** Write `padding: var(--cds-size-padding-m)`, never
`calc(var(--cds-size-padding-m) * 1px)`.

**Always prefer `--cds-*` over `--token-*`.** The `--token-color-*` primitives are the raw
ramps; they do not respond to scheme, brand, or appearance. Using one freezes a color and
breaks theming. `--cds-*` is the semantic layer and is the only layer you should reference.

## Picking a color

| Need | Token |
| --- | --- |
| Page canvas | `--cds-color-background-default` |
| Card / panel surface | `--cds-color-background-surface` |
| Subtle fill inside a surface | `--cds-color-background-muted` |
| Primary text | `--cds-color-foreground-primary` |
| Secondary text, captions | `--cds-color-foreground-secondary` |
| Text on a brand-filled surface | `--cds-color-foreground-on-reverse`, `-on-reverse-secondary` |
| Text on your own custom surface | `--cds-color-foreground-on-surface`, `-on-surface-secondary` |
| Brand accent text | `--cds-color-foreground-brand-primary` |
| Brand fills | `--cds-color-bg-brand-primary`, `-secondary`, `-tertiary`, `-shade` |
| Icons | `--cds-color-icon-primary`, `--cds-color-icon-secondary` |
| Borders | `--cds-color-border-default`, `-strong`, `-focus`, `-danger` |
| Error / success / warning text | `--cds-color-foreground-danger`, `-success`, `-warning` |
| Scrim behind an overlay | `--cds-color-bg-scrim` |

`--cds-color-foreground-tertiary` is for hairlines, dividers, and disabled controls only —
it fails contrast as body text.

## Spacing, radius, icon size

- Padding: `--cds-size-padding-xxxs` 2, `xxs` 4, `xs` 8, `s` 12, `m` 16, `l` 24, `xl` 32,
  `xxl` 40
- Gap: `--cds-size-gap-xs` 4, `s` 8, `m` 16, `l` 24
- Radius: `--cds-size-corner-xxsmall` 4, `xsmall` 8, `small` 12, `medium` 16, `large` 24,
  `xlarge` 40, `full` 9999
- Icon: `--cds-size-icon-small` 12, `medium` 16, `large` 24
- Border width: `--cds-size-border` (1px)

Never hardcode a pixel value when one of these covers it.

## Typography

Each preset is a `font` shorthand. **Display presets require their companion tracking
token** — the `font:` shorthand cannot carry `letter-spacing`, so using a display preset
alone renders it too wide:

```css
font: var(--cds-type-display-medium);
letter-spacing: var(--cds-type-display-medium-tracking);
```

| Preset | Face | Size / weight | Use for |
| --- | --- | --- | --- |
| `--cds-type-display-xlarge` | Oswald | 80 / 500 | Marketing hero only |
| `--cds-type-display-large` | Oswald | 64 / 600 | Balance figures, big numerals |
| `--cds-type-display-medium` | Oswald | 48 / 500 | Secondary large numerals |
| `--cds-type-display-small` | Oswald | 24 / 500 | Card titles in display voice |
| `--cds-type-display-xsmall` | Oswald | 21 / 500 | Screen and section titles |
| `--cds-type-heading` | Mona Sans | 24 / 500 | Prose headings |
| `--cds-type-body-large` / `-strong` | Mona Sans | 16 / 500, 600 | Primary body copy |
| `--cds-type-body-medium` / `-strong` | Mona Sans | 14 / 500, 700 | Default UI text |
| `--cds-type-body-small` / `-strong` | Mona Sans | 12 / 500, 600 | Captions, meta |

Body and heading presets have no tracking token — do not invent one.

## Shadows

Prebuilt and composed already: `--cds-shadow-surface` (cards), `--cds-shadow-control`,
`--cds-shadow-control-raised`, `--cds-shadow-focus-ring`. Do not assemble a `box-shadow`
from parts.

## Tokens in JS

For inline styles, import the accessors rather than typing property names:

```tsx
import { color, shadow, size, type } from '@screentime/cheddar-ds/tokens'

<div style={{ background: color.backgroundSurface, font: type.bodyMedium, padding: size.paddingM }} />
```

`color`, `type`, and `shadow` return `var(--cds-…)` strings, so values keep tracking the
active theme. `size` returns plain numbers in px (`size.paddingM === 16`) — fine in a React
style object, but in raw CSS use the custom property instead. `resolvedColor` and
`getResolvedColors(mode, brand)` give real color strings for the rare case that needs one,
such as a canvas or a `theme-color` meta tag; they are frozen values, so never use them for
ordinary styling.
