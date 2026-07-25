# Figma parity audit — Cheddar DS

Audited against Figma file `JZfxpUBr0jz86f8imEBEdC` ("Cheddar Product Design System"), section `5179:2246` ("Mobile"), plus every component published to that file's library.

Baseline: `@screentime/cheddar-ds@1.1.0`. Consumer under test: `screentime-cheddar-app/apps/web`.

---

## 1. What the Figma source actually contains

Node `5179:2246` is **not** a component-set page — it is the screen gallery. It holds 8 flows, each drawn in 8 brand/mode permutations:

| Flow | Frames | Notable content |
| --- | --- | --- |
| Landing | 8 | Logo, headline, intro illustration, two buttons |
| Home | 16 | Total Savings card, spending chart, notification, goal list, article card, activity list |
| Add Goal | 8 | Page header with back, amount display, **numpad**, primary action |
| Goal | 8 | Goal detail, activity list |
| Goal Reached | 8 | Celebration illustration, slider-to-continue |
| Savings | 8 | Donut chart panel, goal list, completed-goal carousel |
| Learn | 8 | Search, article grid, customer stories |
| Profile | 8 | Profile card, **savings streak**, badges, accounts, goal summary |

Instance census across the section (the strongest signal of what the library actually owes the app):

```
168 Activity Item      96 Numpad Key        72 Card / Goal        56 Savings
 48 Button             40 Nav               32 View All Link      32 Card / Article Small
 24 Panel / Chart      24 Notification      24 Card / Goal Finished
 24 Card / Badges      16 Page header       16 Card / Total Savings
 16 Card / Guide       16 Card / Customer Article    16 Avatar
  8 Slider              8 Savings Streak     8 Card / Profile
  8 Card / Goal Summary 8 Card / Account
```

The 8 permutations per flow are the 4 brand ramps (magenta, blue, green, purple) crossed with two surface treatments. Critically, the app-screen treatment is **not dark mode**: the canvas is `--cds-color-bg-brand-primary` (`brand-100`, e.g. `#64002d` magenta / `#0a008f` blue) carrying white and `brand-600` surfaces, with dark-mode foreground semantics.

---

## 2. Figma → code mismatches

### 2.1 Missing components (published in Figma, absent from the library)

| Figma component | Node | Instances | Status in v1.1.0 |
| --- | --- | --- | --- |
| `Text Link` | `4991:6585` | **86** | No export. Section "View all ›" affordance reimplemented in the app. |
| `Numpad Key` | `7041:13264` | **96** | No export. App built its own `Keypad` from `Button`s. |
| `Card / Goal` | `4438:4323` | **81** | Only reachable as four hardcoded `Card variant="goal-*"` strings. |
| `Panel / Chart` | `4456:1568` | 27 | No export. App drew spending charts in hand-written CSS. |
| `Savings Streak` | `4995:9705` | 8 | No export. |
| `Graphs` | `4995:11582` | 0 | No export (unused in screens; low priority). |
| `Chrome illustration` | `4438:1362` | 8 | Assets existed but were not addressable. |
| `Illustration / Large` | `4993:10163` | 20 | No export. |

`Status Bar - iPhone` (`5187:4953`) and `Home Indicator` (`5114:9383`) are published and used 76×/36× respectively, but are **deliberately excluded** — consumers supply top safe-area padding instead.

### 2.2 Property-name and variant mismatches

| Component | Figma property | v1.1.0 Code Connect read | Effect |
| --- | --- | --- | --- |
| `Notification` | `Type` (+ `Close button`) | `Property 1` | **Broken.** Resolved to `undefined`, emitting `<Notification variant="" />` into every dev's editor. `Close button` was unmapped. |
| `Card / Goal` | `Variant` incl. a 4th `Goal reached` option | — | No mapping at all. |
| `Panel / Chart` | `Type` + `Savings Type List` slot | — | No mapping. |
| `Numpad Key` | `Label`, `Type` (Number/Decimal/Backspace) | — | No mapping. |
| `Search` | `Value`, `State` (Placeholder/Active) | `Value` only | `State` unmapped. |
| `Card / Activity` | `contents` **slot** | slot read correctly | React `Card` did not accept `children`, so the emitted snippet did not compile. |
| `Icon Button` | `Variant` = Primary/Neutral/Outline | maps a 4th `ghost` | Code has a `ghost` variant with no Figma counterpart. Kept — the app relies on it — but it is a code-only extension. |

### 2.3 API mismatches (component exists, but cannot express the design)

| Component | Gap | App workaround being removed |
| --- | --- | --- |
| `Nav` | No click handlers of any kind; `activeItem` union excluded `add`; center Add action unreachable | Absolutely-positioned invisible `<button>` grid overlaid on the nav (`nav-hit-areas`) |
| `PageHeader` | Back button rendered with no `onClick`; no leading/trailing slots | Local `AppHeader` component |
| `Avatar` | `size` only — no `src`, `alt`, or initials; three PNGs hardcoded; `alt=""` always | Could not show a real user; DS avatar art used verbatim |
| `InputField`, `Textarea`, `Search`, `Checkbox`, `Radio`, `SwitchField` | No native attribute passthrough (`name`, `type`, `autoComplete`, `required`…), no validation/error state, `description` not wired to `aria-describedby` | Unusable in real forms |
| `ActivityItem` | Only `type`/`time`/`amount`; title and icon hardcoded | Formatting hacked into the `amount` string |
| `Notification` | Copy and icon hardcoded per variant | Overrode `title`/`body` only; icon impossible |
| `Slider` | Fixed magenta styling, raw `rgba()` shadow, no completion callback | "Slide to unlock" faked by watching `value >= 98` inside `onValueChange` |
| `Card` | 24 variants of hardcoded product content (24 dollar amounts, 24 titles) | **Never imported.** The app reimplemented every card in local CSS. |

`Card` going entirely unused by its only consumer is the clearest single finding in this audit.

### 2.4 Token and theming mismatches

| Issue | Detail |
| --- | --- |
| **JSON was not authoritative** | `tokens/cheddar.tokens.json` was *generated from* a script with hex values hardcoded inside it, mirroring `tokens.css`. CSS was the real source; the DTCG file was a lossy downstream copy. |
| **Fixed magenta in theme-sensitive tokens** | `--cds-color-background-default: #f5f0f3`, `--cds-color-background-muted: #f2eaf0`, dark `#1a131a` / `#2b1f2b` / `#332534`, and `--cds-shadow-surface: 0 8px 24px rgba(88, 19, 61, 0.08)` were all magenta-tinted literals. Selecting `data-brand="blue"` left a pink cast on every page and card surface. |
| **Raw color literals in components** | `.switch-thumb` `box-shadow: 0 1px 2px rgba(0,0,0,0.2)`; `.slider-thumb` `box-shadow: 0 4px 12px rgba(0,0,0,0.18)`. |
| **No branded app-shell appearance** | The Figma screens' brand canvas had no token representation. The app approximated it with `<ThemeScope scheme="dark">` plus its own `--app-bg: var(--cds-color-brand-100)` override — so DS dark mode (`#1a131a`) and the actual design (`#64002d`) never agreed. |
| **No validation tokens** | The Figma library defines no error/danger colour, so form validation states had nothing to reference. |
| **Foreign tokens leaking into the design** | Screen variable bindings included `var(--ads-color-primary)` and `var(--sds-size-stroke-border)` from the Astra and Simple Design System libraries, plus raw `Cheddar/Black Cherry` and `Cheddar/Orange` styles. Flagged for design cleanup — not fixable in code. |
| **No Swift output** | Only CSS was generated, despite an iOS `CheddarDS` Swift package existing in the consumer monorepo. |

### 2.5 Content mismatches (Figma copy vs. hardcoded code copy)

The `Card` badge variants had drifted from the design:

| Badge | Figma | v1.1.0 code |
| --- | --- | --- |
| Finance Nerd | `8 of 10 Articles read` | `8 of 10 Articles read` ✓ |
| Double Down | `1 of 2 goals this month` | `5 of 8 Goals completed` ✗ |
| Stack Master | `$194.70 of $500.00 total savings` | `11 of 12 Weeks complete` ✗ |

Prop-driven components make this class of drift structurally impossible.

---

## 3. Accessibility findings

| Finding | Components |
| --- | --- |
| `description` text rendered but never associated with its control | `InputField`, `Textarea`, `Checkbox`, `Radio`, `SwitchField` |
| `aria-label` used where a real `<label for>` existed, duplicating the accessible name | Same set |
| No `aria-invalid` / error messaging path | All form controls |
| No visible focus indicator | Library-wide — no `:focus-visible` rule existed |
| Nav items were not focusable or operable | `Nav` |
| Back button was a focusable control that did nothing | `PageHeader` |
| Progress bars had no `role="progressbar"` or value semantics | `Card` goal/badge variants |
| Single-letter day labels with no accessible name | Savings streak (absent) |

---

## 4. What was reused rather than rebuilt

Per the brief, existing Figma components and assets were reused:

- All 30 icons come from the existing `Icon` component and `IconName` union — no new glyphs authored.
- `Button`, `IconButton`, `Avatar`, `Logo`, `Wordmark`, `Icon`, `Tag`, `ActivityItem` are composed by the new card components rather than reimplemented.
- Demo imagery is the approved `Chrome illustration` set already in `src/assets/`, re-exported under semantic names — no new artwork.
- The existing `[data-theme]` / `[data-brand]` token architecture was extended with a third axis, not replaced.
- All 24 `Card` variants survive as deprecated adapters over the new components.
