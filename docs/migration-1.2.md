# Migrating to `@screentime/cheddar-ds@1.2.0`

`1.2.0` is a **backward-compatible minor release**. Nothing exported by `1.1.0` was
removed or renamed, no token was deleted, and no required prop was added. You can
upgrade, ship, and migrate afterwards.

The release exists to close the gaps recorded in
[`figma-parity-audit.md`](./figma-parity-audit.md): the library could not express the
mobile design, so `apps/web` had reimplemented most of it locally.

---

## 1. Upgrade

```bash
npm install @screentime/cheddar-ds@1.2.0
```

No import changes are required. If your build passes on `1.1.0` it will pass on `1.2.0`.

Two things are worth doing in the same commit, because they are what makes the rest of
this document useful:

```tsx
// The branded app shell is now a first-class appearance instead of a dark-mode hack.
- <ThemeScope brand={brand} scheme="dark">
+ <ThemeScope brand={brand} appearance="brand">
```

```css
/* Delete any local override of the app canvas — the token now resolves correctly. */
- :root {
  --app-bg: var(--cds-color-brand-100);
}
```

---

## 2. New exports

### Components

| Export          | Replaces (in `apps/web`)            | Figma                                 |
| --------------- | ----------------------------------- | ------------------------------------- |
| `TextLink`      | local `ViewAllLink`                 | `Text Link` (86 instances)            |
| `Sheet`         | local `BottomSheet`                 | _no published component set_ — see §6 |
| `NumberPad`     | local `Keypad` built from `Button`s | `Numpad Key` (96 instances)           |
| `SectionHeader` | local `SectionTitle`                | section headings across the screens   |

### Cards and panels

These replace the `Card variant="…"` registry. All content arrives through props.

| Export               | Figma                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `TotalSavingsCard`   | `Card / Total Savings`                                                                    |
| `GoalCard`           | `Card / Goal`                                                                             |
| `ArticleCard`        | `Card / Article Large`, `Card / Article Small`, `Card / Guide`, `Card / Customer Article` |
| `CompletedGoalCard`  | `Card / Goal Finished`                                                                    |
| `ProfileCard`        | `Card / Profile`                                                                          |
| `BadgeCard`          | `Card / Badges`                                                                           |
| `AccountCard`        | `Card / Account`                                                                          |
| `GoalSummaryCard`    | `Card / Goal Summary`                                                                     |
| `SpendingChartPanel` | `Panel / Chart`                                                                           |
| `SavingsStreak`      | `Savings Streak`                                                                          |

Shared vocabulary: `Accent` (the four brand ramps), and `formatAmount` / `Money` /
`AmountFormatter` for money rendering, so amount formatting is consistent across cards
and overridable per call site.

### Types

Every component now exports its props type (`ButtonProps`, `GoalCardProps`, …).
`1.1.0` exported none of them, so consumers were writing `Parameters<typeof Button>[0]`.

### Subpaths

| Subpath                                                      | Contents                        |
| ------------------------------------------------------------ | ------------------------------- |
| `@screentime/cheddar-ds/demo-assets`                         | typed demo imagery manifest     |
| `@screentime/cheddar-ds/tokens`                              | typed token accessors for React |
| `@screentime/cheddar-ds/tokens.json`                         | the DTCG source document        |
| `@screentime/cheddar-ds/platforms/swift/CheddarTokens.swift` | generated Swift tokens          |

---

## 3. Expanded component APIs

Every addition is optional and defaults to the `1.1.0` behaviour.

**`Nav`** — was decorative; `apps/web` overlaid an invisible button grid on it. Now takes
`onItemSelect(key)`, `onAddSelect()` for the centre Add action, `items` to replace the
default five, `showLabels`, and `addLabel`. Every destination is in the tab order, with
arrows/Home/End as an additional shortcut, and the active item reports `aria-current`.
**Delete your hit-area overlay** — it will now sit on top of real controls and swallow
their events.

**`PageHeader`** — `onBack` makes the back control live. Without it the control renders
inert (disabled, `aria-hidden`) so the layout is unchanged but it is no longer a
focusable dead end. Also `leading`/`trailing` slots, `align` (superseding `variant`),
`as` for the heading level, and `backLabel`/`showBack`.

**`Avatar`** — `src`, `alt`, `name`, `initials`. Falls back `src` → initials → bundled
artwork, and falls back to initials if the image fails to load. `name` supplies both the
initials and, absent `alt`, the accessible name.

**Form controls** (`InputField`, `Textarea`, `Checkbox`, `Radio`, `SwitchField`,
`Search`) — native attributes now pass through (`name`, `type`, `autoComplete`,
`required`, `disabled`, `pattern`, …), refs forward to the underlying element, and there
is a real validation path: the error message is wired to the control via
`aria-describedby` and sets `aria-invalid`. `description` is now also properly
associated, which it was not in `1.1.0`.

One behaviour fix in the same area: **uncontrolled `Radio` groups did not work.** Each
`Radio` owned its own state and rendered as a React-controlled input, so selecting a
sibling re-rendered the previous one as still checked, which re-checked it in the DOM and
dropped the new selection — clicking an unselected radio was a no-op unless you drove the
group with `checked`. Uncontrolled radios now let the browser own exclusivity and mirror
it, and a radio that loses the selection reports `onCheckedChange(false)`. Controlled
groups are unaffected.

**`ActivityItem`** — `title`, `subtitle`, `icon`, `onClick`, `href` on top of the
existing `type`/`time`/`amount`. Renders a `<button>` or `<a>` when interactive.

**`Notification`** — `title`, `body`, `linkLabel`, `icon`, `image`, `action`, `onDismiss`,
`onLinkClick`, `href`, `showDismiss`, `dismissLabel`. Per-variant defaults are unchanged,
so existing usage renders identically.

**`Slider`** — `onComplete` fires once when the value reaches `completeAt` (default
`max`), deferred to pointer/key release unless you set `completeOnRelease={false}`. Also
`snapOnComplete`, `formatValue`, `step`, controlled `value`. If you were faking
completion by watching `value >= 98` inside `onValueChange`, delete it.

---

## 4. Replacing `Card`

`Card` still works. Every variant delegates to its replacement internally, so output is
unchanged — but it cannot carry real data, which is why `apps/web` never imported it.

| Old variant                                                       | Replacement                     |
| ----------------------------------------------------------------- | ------------------------------- |
| `article-large`, `guide`, `customer-article-*`, `article-small-*` | `ArticleCard`                   |
| `total-savings`                                                   | `TotalSavingsCard`              |
| `goal-*`                                                          | `GoalCard`                      |
| `goal-finished*`                                                  | `CompletedGoalCard`             |
| `badge-*`                                                         | `BadgeCard`                     |
| `account`                                                         | `AccountCard`                   |
| `goal-summary`                                                    | `GoalSummaryCard`               |
| `profile`                                                         | `ProfileCard`                   |
| `activity`, `activity-feed`                                       | compose `ActivityItem` yourself |

```tsx
- <Card variant="goal-headphones" illustration={headphonesPng} />
+ <GoalCard
+   name={goal.name}
+   target={goal.targetCents / 100}
+   saved={goal.savedCents / 100}
+   accent={goal.accent}
+   image={goal.imageUrl}
+   onClick={() => open(goal.id)}
+ />
```

Two content fixes come with the switch: the `Double Down` and `Stack Master` badge
captions in `1.1.0` had drifted from Figma and are corrected in `BadgeCard`. Goal
progress bars now expose `role="progressbar"` with value semantics.

---

## 5. Tokens

**The DTCG document is now the source of truth.** `tokens/cheddar.tokens.json` is
hand-edited, and `scripts/build-tokens.mjs` generates the CSS, the typed React module,
and the Swift package from it. `npm run tokens:check` fails the build if the generated
outputs drift. Previously the JSON was generated _from_ hardcoded hex values that
mirrored the CSS, so it was a lossy copy rather than a source.

### Nothing was removed

24 tokens were added, 0 removed or renamed. The additions cover the gaps that forced raw
literals into component CSS:

- Surfaces: `--cds-color-foreground-on-surface` / `-secondary` / `-tertiary`. See the
  appearance section below for why a surface needs its own foreground.

- Feedback: `--cds-color-foreground-danger` / `-success` / `-warning`,
  `--cds-color-bg-danger`, `--cds-color-border-danger` (the Figma library defines no
  error colour, so these derive from a new `red` primitive ramp).
- Focus: `--cds-color-border-focus`, `--cds-shadow-focus-ring`. There was no
  `:focus-visible` treatment in `1.1.0` at all.
- Controls: `--cds-shadow-control`, `--cds-shadow-control-raised`,
  `--cds-color-shadow-control`, `--cds-color-shadow-surface`, `--cds-color-track-default`.
- Primitives: `--token-color-red-100…600`, `--token-color-neutral-700…900`.

### Six value changes to know about

1. **Theme-sensitive backgrounds are no longer magenta literals.** `#f5f0f3`, `#1a131a`,
   `#2b1f2b`, `#332534` and `0 8px 24px rgba(88, 19, 61, 0.08)` are now `color-mix()`
   expressions over the _active_ brand ramp. Under `data-brand="magenta"` the resolved
   colours are within a hair of the old literals, so magenta screens look the same. Under
   blue, green, or purple the pink cast is gone. This requires `color-mix()`
   (Safari 16.2+, Chrome 111+, Firefox 113+); if you must support older engines, the
   DTCG document carries a concrete resolved fallback per token.
2. **Typography tokens now include the font family.** `--cds-type-*` were emitting
   `500 var(--cds-size-font-l) / 1.4`, which is not a valid `font:` shorthand — the
   family is required, so any rule using `font: var(--cds-type-heading)` was being
   dropped entirely. They now end with `var(--cds-font-family-display|text)`. If you
   were compensating with a separate `font-family` declaration, you can drop it.
3. **`--cds-color-foreground-on-reverse` in dark mode** now resolves to
   `--cds-color-brand-100` rather than `--cds-color-foreground-brand-tertiary`, which is
   what the Figma screens actually specify for text on a reversed surface.
4. **`--cds-color-border-strong` is darker in the light scheme** — 56% black rather than
   20%. At 20% the outline delineating every text field measured 1.6:1 against its card,
   where WCAG 1.4.11 wants 3:1 for a control boundary. Fields now read as bounded.
5. **`--cds-color-border-focus` uses the 200 ramp stop** rather than 300. The green
   brand's focus ring was the weakest of the four at 2.2:1; all four now clear 3:1.
6. **`--cds-color-bg-on-brand` uses `brand-100`** in the dark scheme and the brand
   appearance, not `brand-200`. Purple primary button labels were 3.38:1 against their
   own fill.

### The new `appearance` axis

`ThemeScope` gained `appearance?: 'surface' | 'brand'` (default `surface`), rendering
`data-appearance`. The `brand` appearance is the app-shell treatment the Figma screens
use: a saturated `brand-100` canvas carrying white cards.

This is a **third axis**, orthogonal to `brand` and `scheme` — it was added rather than
folded into `scheme` because the design is not dark mode. `apps/web` was approximating it
with `scheme="dark"` plus a local `--app-bg` override, which meant DS dark mode
(`#1a131a`) and the actual design (`#64002d`) never agreed.

#### Why surfaces have their own foreground

The branded shell is the only appearance whose canvas and surfaces have **opposite
polarity**: the canvas is dark, the cards sitting on it stay white. Light and dark mode
never have this problem — one foreground colour works on both their canvas and their
surfaces — so `--cds-color-foreground-primary` alone cannot serve the shell. Borrowing
dark mode's foregrounds, which is what the first cut of this appearance did, paints white
text on white cards.

So `foreground-primary` is the **canvas** pairing, and `--cds-color-foreground-on-surface`
is the surface pairing. You rarely need to choose between them: `tokens.css` re-establishes
the full light set on every element that paints `--cds-color-background-surface`, so nested
component rules keep using the ordinary tokens and stay legible. Reach for `on-surface`
only when you build a custom surface of your own:

```css
.my-custom-card {
  background: var(--cds-color-background-surface);
  color: var(--cds-color-foreground-on-surface);
}
```

If you add such a component to the DS itself, add its selector to `SURFACE_SELECTORS` in
`scripts/build-tokens.mjs` so its whole subtree is re-scoped. Components that deliberately
sit on the canvas — `GoalCard`, `SectionHeader`, `SavingsStreak` — are transparent or paint
a brand fill and need no entry.

Two related fixes fell out of the same reasoning. `--cds-color-background-muted` in the
brand appearance is now `brand-200` rather than the near-white `brand-600`, which was
invisible behind the canvas's light glyphs. And the four cards that paint
`--cds-color-bg-brand-secondary` now take their text from
`--cds-color-foreground-on-reverse` instead of the raw `brand-500` stop, which did not move
with the mode while their background did — the hero balance on `TotalSavingsCard` was
1.09–1.38:1 in the dark scheme.

---

## 6. Demo assets

```tsx
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'

<GoalCard image={demoAssets.goals.headphones} … />
```

Groups: `goals`, `articles`, `celebration`, `avatars`, `brand`, `misc`. Keys are typed,
so a typo is a compile error, and `npm run assets:check` fails the build if a referenced
file is missing from disk.

**No component imports this module.** Every component that renders an image takes it as a
prop, which keeps the ~5 MB of demo imagery out of the main entry point — importing
`GoalCard` does not pull in any artwork. The only images in `dist/index.js` are the three
small `Avatar` fallback PNGs (~4 KB total). Pay for the demo bytes only if you import the
manifest.

Per the brief, no iOS status bar component or asset ships. `Status Bar - iPhone`
(76 instances) and `Home Indicator` are deliberately unmapped — supply top safe-area
padding yourself.

---

## 7. Deprecated in `1.2.0`

Still exported, still working, scheduled for removal in `2.0.0`.

| API                                         | Replacement                                              |
| ------------------------------------------- | -------------------------------------------------------- |
| `Card`                                      | the card component matching your shape (§4)              |
| `CardVariant`, `CardProps`, `ActivityEntry` | the replacement component's props type                   |
| `Card`'s `variant` prop                     | —                                                        |
| `Card`'s `items` / `entries` props          | compose `ActivityItem`                                   |
| `Card`'s `illustration` prop                | each replacement takes `image`                           |
| `PageHeader`'s `variant` prop               | `align` (identical values; `align` wins if both are set) |

---

## 8. Code Connect

37 mappings publish cleanly against the Figma library, up from 29. Notable fixes:

- `Notification` was reading a property named `Property 1` that does not exist; it is
  `Type`. Every snippet it emitted contained `variant=""`. `Close button` is now mapped
  too.
- `Card / Goal` (81 instances, the most-used card in the file) had no mapping at all.
- `Search` ignored its `State` property, so the `Placeholder` state emitted the
  placeholder copy as a real `value` — a search field pre-filled with "Search anything".
- `Card / Activity` read its `contents` slot correctly, but emitted a `Card` that does not
  accept children, so the snippet did not compile. It now emits a composed `ActivityItem`
  list.
- `Logo` and `Wordmark` shipped in React with no mapping.
- The 11 `Card*.figma.ts` templates now emit the prop-driven components.

`Sheet` has **no Figma mapping** because there is no published component set for it —
bottom sheets exist only as frames inside the screen designs. It ships as a code-only
primitive. If a `Sheet` component set is published later, add
`src/components/sheet/Sheet.figma.ts`.

Unmapped published components, all deliberate: `Status Bar - iPhone` and `Home Indicator`
(excluded by the brief), the seven `Sites` page components (marketing site, not the app),
and four unused illustration/asset components.

---

## 9. Accessibility fixes

An axe-based suite covering every exported component surfaced seven defects, all fixed.
Four were token values and are described in section 5. The other three changed markup:

- **`Nav` took four of its five destinations out of the tab order.** It applied a roving
  `tabIndex` without a composite widget role, so nothing told a keyboard user that arrow
  keys were expected and Tab reached only the active item (WCAG 2.1.1). A bottom nav is a
  set of destinations rather than a composite widget, so every item is now tabbable and
  the arrow keys remain as a shortcut.
- **Interactive `GoalCard` and `BadgeCard` dropped their progress value.** Both render
  `role="progressbar"`, but when `onClick` or `href` turns the whole row into a control,
  ARIA makes its children presentational and `aria-valuenow` never reaches assistive tech.
  The percentage and amounts are now folded into the control's accessible name:
  `"Headphones, $50.00 of $200.00, 25% saved"`. **If you assert on the accessible name of
  an interactive card, update the expected string**; pass your own `aria-label` to
  override it. Non-interactive cards are unchanged.
- **Uncontrolled `Radio` groups could not move selection.** Clicking an unselected radio
  left the previously checked one checked, so the group was inert unless controlled.
  `Radio` now mirrors the native DOM state.

Contrast is now asserted across all 240 combinations of 20 semantic pairings × 3 modes ×
4 brands, with a regression guard that rejects any rule pairing a mode-dependent background
with a raw `brand-N` ramp stop.

Building the gallery surfaced five more defects, all fixed:

- **The button focus ring was hardcoded blue.** `.btn`, `.icon-btn` and `.nav-icon` used a
  literal `--token-color-blue-300` outline, so every brand got a blue ring while inputs got
  a brand one. It now uses `--cds-color-border-focus`.
- **Inactive `Nav` icons and labels, and ghost icon buttons, used
  `--cds-color-foreground-tertiary`** — an 8%-black decorative tone that measures 1.61:1 on
  a surface. They now use `foreground-secondary` (4.94:1). The token itself is unchanged and
  now carries a `$description` saying it is for hairlines, dividers and disabled controls
  only; the one remaining use, a disabled `NumberPad` key, is correct because WCAG 1.4.3
  exempts inactive controls.
- **`SpendingChartPanel`'s bar variant was broken.** The root took `chart-panel-${type}`,
  which for `type="bar"` collided with the inner bar's own class and collapsed the whole
  panel into a 16px pill with no chart. The root modifier is now namespaced
  `chart-panel-type-*`. **If you targeted `.chart-panel-bar` expecting the root, use
  `.chart-panel-type-bar`.**
- **`PageHeader` crushed its slots.** A fixed `32px 1fr 32px` grid squeezed a populated
  `leading` slot to a sliver and still stole 80px from the title when both slots were empty.
  The tracks are now `auto 1fr auto`.
- **Small secondary `Button` vanished on the branded canvas.** `.btn-secondary-small-fill`
  paired a subtle brand fill with `border-color: transparent`; under `appearance="brand"`
  that fill is the canvas colour, leaving no fill and no boundary. It is now outlined like
  secondary at every other size.

One tooling note: `playwright.config.ts` held `maxDiffPixelRatio: 0.02` to absorb
cross-machine font rasterisation, but that forgives _arbitrarily_ different pixels up to 2%
of an image — it let the blue-to-brand focus ring change pass unnoticed at 1.6% of a small
specimen. The ratio is now `0.002` with `threshold: 0.2`, which is the knob actually aimed
at anti-aliasing. Tightening it immediately exposed 20 masked diffs.

## 10. Figma parity corrections

A pass comparing the published component sets against the implementation found five more
mismatches. All are visual, so **expect one round of screenshot-baseline churn** if you keep
your own visual tests.

- **`Button` was a pill at every size.** `.btn` inherited `--cds-size-corner-full` from the
  rule it shares with the circular icon controls. In Figma only `Small` is a pill; `Large`
  and `Medium` are `--cds-size-corner-large` (24px) rounded rectangles. `.btn` now starts
  from `corner-large` and `.btn-small` opts back into `corner-full`.
- **Button labels were one weight too heavy.** They rendered at 600; Figma's
  `Product/Body/body-large` and `body-medium` are both weight 500.
- **Display type had no tracking.** Figma's Display styles are tightly tracked and the
  implementation rendered them at 0, so every headline and balance figure ran wider than the
  design. This is the fix most likely to shift your layouts.

  Figma reports display tracking as a **percent of font size**, which is easy to misread as
  pixels: `display-large` shows `letterSpacing: -4` and `display-medium` shows `-3`, but the
  rendered instances measure -2.56px at 64px and -1.44px at 48px — that is -4% and -3%, not
  -4px and -3px. Reading them as pixels collapses both to a single -0.0625em, which is
  1.6x too tight at `display-large` and 2.1x too tight at `display-medium`. Each step
  therefore carries its own value:

  | Style            | Figma | em        | at its size     |
  | ---------------- | ----- | --------- | --------------- |
  | `display-xlarge` | —     | -0.05em   | -4px at 80px    |
  | `display-large`  | -4%   | -0.04em   | -2.56px at 64px |
  | `display-medium` | -3%   | -0.03em   | -1.44px at 48px |
  | `display-small`  | —     | -0.015em  | -0.36px at 24px |
  | `display-xsmall` | —     | -0.0131em | -0.28px at 21px |

  Only `display-large` and `display-medium` are used by a published Figma component, so only
  those two are measured. `xlarge`, `small` and `xsmall` exist as library text styles that
  nothing instantiates; their values are interpolated on the -1%-per-16px slope the measured
  pair defines, and are the one number here worth confirming with design.

  CSS's `font:` shorthand cannot carry `letter-spacing`, so each typography token with
  tracking now emits a companion var alongside it, and display use sites pair the two:

  ```css
  font: var(--cds-type-display-medium);
  letter-spacing: var(--cds-type-display-medium-tracking);
  ```

  `src/styles/typography.test.ts` fails the build if a display style is used without its
  tracking var. Body and heading styles report `letterSpacing: 0` in Figma and deliberately
  have no companion var.

- **`--cds-type-display-large` was weight 500**, but Figma's `Product/Display/display-large`
  is Oswald **SemiBold (600)**.
- **Dark-mode article and profile card text was illegible.** The reverse-brand cards set
  `color: var(--cds-color-foreground-on-reverse)` correctly on the root, but five child
  rules overrode it with the raw primitives `--token-color-white-100` / `white-300`. Those
  are frozen to the light-mode assumption that the card is painted dark, so when dark mode
  flips `bg-brand-secondary` to a _pale_ brand tint the text stayed white — the guide card's
  footer measured **1.08:1**. The children now use `foreground-on-reverse` and
  `foreground-on-reverse-secondary`, which track the surface per mode (that footer is now
  8.70:1).

  This is the same defect class the section 9 regression guard was written for; the guard
  only inspected `brand-N` ramp stops, so the `white-N` variant slipped through.

### Demo asset re-export

Nine illustrations (`brand.coin`, `brand.coinDisc`, `brand.hero`, `misc.globe`,
`misc.question`, `goals.travel`, `goals.goggles`/`goals.skiTrip`, `celebration.sparkle`,
`celebration.sparkleCluster`) plus the three avatar placeholders shipped with an opaque
`#444444` or `#b9b9b9` backdrop baked in, so they showed as grey boxes on any surface. The
artwork in Figma _is_ transparent — the grey is a separate backdrop rectangle in the variant
frame that a flattened export folded in. They have been re-sourced from the transparent
raw fills. No manifest keys changed.

`src/assets/chrome-illustrations/` was removed: nothing imported it and seven of its eight
files were byte-identical to their `src/assets/demo/` counterparts.

### Two deliberate deviations from Figma

Both are known and intentional. Neither is a bug to file.

- **The `ss05` stylistic set is not applied.** Every text layer in Figma carries
  `font-feature-settings: "ss05" 1`, but the Mona Sans build we bundle
  (`@fontsource-variable/mona-sans`) ships no stylistic sets at all — across all 18 font
  files the only GSUB features present are `ccmp`, `dnom`, `frac`, `liga`, `locl`, `numr`,
  `pnum` and `tnum`. Setting the property would be a silent no-op, so it is left off.
  Letterforms are therefore subtly different from the Figma renders. Closing this means
  vendoring the official GitHub Mona Sans release, which is an OFL font-binary decision
  rather than a CSS one; sizes, weights, line heights and tracking all match regardless.
- **Small secondary `Button` keeps a border.** Figma draws it as a pale fill with no border.
  Under `appearance="brand"` that fill _is_ the canvas colour, which left the control with
  neither fill nor boundary (see section 9). The border is retained so the button stays
  visible on the branded shell.

## 11. A second parity pass

Five more mismatches, found by measuring the rendered result against the design rather than
reading the stylesheet. `scripts/probe-figma-parity.mjs` runs those measurements against a
dev server and prints a pass/fail table.

- **The back chevron was drawn twice the size of the design.** The 24x24 tap target was
  right, but the glyph filled it. Figma draws the caret at its intrinsic size inside that
  target: ink 6.6x14.4 with a true 3px stroke, which is 27.67% x 60% of the frame. The
  exported SVG is byte-for-byte the path already in `Icon`, so only the render size was
  wrong. `PageHeader` and the `Notification` "Learn more" caret now size the glyph rather
  than the frame, matching what `SectionHeader` already did.
- **Two-tone icons knocked out in the wrong colour.** `Icon`'s mono tone painted the counter
  shape of two-tone glyphs (`receive`, `send`, `transfer`, `deposit`, `withdraw`) with
  `--cds-color-background-surface`. That is only correct on the page surface; on the
  `TotalSavingsCard` it drew a near-white blob inside the Deposit and Transfer icons. The
  counter now reads a `--cds-icon-knockout` custom property that falls back to the old
  value, and any surface that is not the page surface declares it:

  ```css
  .total-savings-card {
    background: var(--cds-color-bg-brand-secondary);
    --cds-icon-knockout: var(--cds-color-bg-brand-secondary);
  }
  ```

  Every container in the library that paints its own background now declares it:
  `.btn-primary`, `.btn-secondary-small-fill`, `.icon-btn-primary`, `.activity-item-icon`,
  the five `--accent-500` card tiles, `.total-savings-card` and `.profile-card`. Set it on
  your own coloured containers if you place a two-tone icon on one.

  The worst case is the one that hides itself: on `.btn-primary` the glyph is white and the
  old fallback was also white, so the counter vanished into the glyph and the icon rendered
  as a solid blob rather than an obviously wrong colour. `Icon` therefore tags its output
  with `data-tone` and `data-knockout`, which lets a check find a collapsed counter that no
  longer has a second colour to compare against.

  `tests/visual/icon-knockout.spec.ts` walks every two-tone glyph in the gallery across all
  12 brand/mode combinations, resolves the colour actually painted behind it, and fails on
  any that disagree. `scripts/probe-icon-knockout.mjs` is the same check as a one-off report.

- **`TotalSavingsCard` used the wrong foreground and the wrong cents size.** Figma pairs
  `bg-brand-secondary` with `foreground-brand-reverse-secondary`, so the card reads pink on
  maroon in light and magenta on pale in dark; the implementation used
  `foreground-on-reverse` (white) throughout. The action buttons now take their border,
  label and icon from the card's own `color`, so the four can no longer drift apart, and
  their label is `body-large` rather than `body-large-strong`. The cents were set in
  `display-small` (24px) against Figma's `display-medium` (48px) — a visible size change.
  White measured 13.3:1 and the Figma pairing measures 6.7:1, so this stays above AA.
- **Icon buttons shrank their glyph.** `.icon-btn` never reset the UA button padding, so a
  border-box 24px button had only 10px of content box and flex shrank a 16px glyph to fit.
  With `padding: 0` and an explicit transparent border the four sizes now match the Figma
  component set exactly: 48->24, 40->24, 32->16, 24->16. The outline variant had been
  relying on the UA border for its ring, which is now declared.
- **Dark-mode input fields were unreadable.** `.input-shell` painted
  `--token-color-white-300` — a raw 60%-white primitive that does not respond to mode — so
  in dark mode a near-white field carried white text. It now uses `--cds-color-bg-on-brand`,
  which is white in light and `brand-100` (#64002d) in dark, giving 13.3:1.

### Notification spacing

Measured against node `4456:1697`: the header row gap was 8px against Figma's 16px and had
no `min-height`, the "Learn more" link carried a stray `margin-top: 4px` on top of the 2px
column gap, and its focus ring was a hardcoded `--token-color-blue-300` rather than
`--cds-color-border-focus`. Padding (16), radius (24), root gap (8), illustration (80) and
body gap (2) already matched.

The dismiss button's tint moved from `--token-color-black-600` (8%) to a new
`--cds-color-bg-scrim` token. Figma specifies 20% black; as a raw primitive that vanishes on
a dark card, so the token flips to 20% white in dark and on the branded shell.

### Notification illustrations

`Notification` now defaults to the chrome illustration Figma specifies — piggy bank for
`default`, pie chart for `trend`, coin for `opportunity` — sitting directly on the card at
80px with no tile, matching node `4456:1697`. It previously rendered a 36px icon on a tinted
rounded tile.

The tile survives for the `icon` override, which is too small to read on the card unaided,
and moved to its own `.notif-illustration-tile` class. Pass `image` to substitute your own
artwork, or `icon` to go back to a tile.

### Avatar resolution

The avatar assets shipped at exactly their render size — `avatar-40.png` was 40x40 — so they
were soft on every retina display. They are now 4x exports (160/128/96) from the three Figma
variants. The three are the same artwork at different scales, and an avatar image never
renders above 40px in this library (the 96px disc on `ProfileCard` is a container; the image
inside it is an `Avatar`), so 4x covers every current density.

These exports arrive with a white backdrop baked in, the same way the illustrations in
section 10 did. The circle is inscribed in its frame, so transparency was rebuilt with a
circular mask and the feathered edge repainted in the circle's own `brand-200`.

### Two differences left in place

- **`Notification` is mode-aware where Figma is not.** Figma pins the card to
  `brand-500` with `black-100` text in every mode. The implementation uses
  `bg-brand-primary` with `foreground-primary`, so it inverts in dark rather than staying a
  fixed pink card with black text. Keeping Figma's literal values would make dark-mode text
  white on light pink.
- **The `TotalSavingsCard` logo mark is inverted relative to Figma.** Figma shows a pink
  ellipse with a dark star; the implementation nests the mark in a pale pill, giving a dark
  ellipse with a pale star. Pre-existing and untouched by this pass.
