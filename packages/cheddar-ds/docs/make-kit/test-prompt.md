# Testing the Make kit

A repeatable test for one question: does Make build Cheddar screens *out of the package*
without being told to?

The prompt below names no component, prop, or token. That is deliberate. Naming them turns
the test into an instruction-following check and hides the failures worth finding. Every
component Make should reach for has to be inferred from the guidelines.

Run it after every guidelines edit and every package release, and record the result in the
run log at the bottom.

## 1. Prompt

Paste verbatim into a Make file with the kit attached.

```
Build the Cheddar home screen for our teen savings app, plus the flow for
adding money.

Home shows how much the user has saved in total, with quick actions to
deposit or transfer. Below that, their savings goals with progress toward
each target, and a heading with a way to see all of them. Then one insight
card about their spending trend, and a recent activity list grouped
together on its own panel.

A bottom tab bar switches between home, wallet, add, learn and profile.
Tapping add opens an amount entry screen with a keypad, and confirming
brings up a confirmation step before the deposit goes through.

Use realistic placeholder content for a 16-year-old saving for a trip and
a pair of headphones.
```

The prompt is built to bait every known failure mode at once: a keypad invites hand-rolled
buttons, a confirmation step invites a custom modal, imagery invites Unsplash, the branded
canvas invites `scheme="dark"`, money invites pre-formatted strings, and the grouped panel
invites the island-rule bug.

## 2. Investigate

Open the generated code and check each item.

### Renders correctly

These are the ones that produce visibly broken output. Check the preview first, then the code.

- [ ] Components are styled at all — if everything is unstyled markup, `styles.css` was never
      imported
- [ ] Demo images actually render, rather than empty accent tiles and blank illustration
      frames (regression check: this was broken by the package until 1.2.3)
- [ ] The branded shell has a painted maroon canvas, and section headings and "View all"
      links are legible against it (regression check: unpainted canvas plus flipped
      foregrounds gives white-on-white)
- [ ] `Nav` sits at the bottom in a width-constrained container, with its inactive icons
      visible

### Setup — from `setup.md`

- [ ] `import '@screentime/cheddar-ds/styles.css'` present exactly once at the entry point
- [ ] Outermost `ThemeScope` carries `className="cds-app-canvas"`
- [ ] No font links, `@fontsource` installs, or `font-family` declarations
- [ ] No dependencies added that duplicate what the package already ships

### Component reuse — from `components.md`

- [ ] No locally defined `Button`, `Card`, `Input`, `Modal`, `Sheet`, `Keypad`, `TabBar`, or
      `ProgressBar`
- [ ] No `<Card variant="…">` anywhere
- [ ] Amount entry uses `NumberPad`, not a grid of `Button`s
- [ ] Confirmation uses `Sheet`, not a custom overlay or `<dialog>`
- [ ] Bottom bar uses `Nav` with `onItemSelect`, with no hit-area overlay on top of it
- [ ] Total uses `TotalSavingsCard`; goals use `GoalCard` with numeric `target`/`saved`, not
      strings
- [ ] Activity rows use `ActivityItem` inside `ActivityCard`
- [ ] Insight uses `Notification`
- [ ] Images come from `demoAssets`, not Unsplash or invented URLs
- [ ] Every `IconButton` has a `label`; all icon names resolve (a bad one is a type error)

### Theming and styling — from `styles.md` and `tokens.md`

- [ ] Branded shell is `appearance="brand"`, not `scheme="dark"` plus a background override
- [ ] The grouped activity panel is wrapped in `<ThemeScope scheme="light">` — the item most
      likely to fail
- [ ] No Tailwind utilities or `className` overrides on DS components
- [ ] No CSS targeting `.btn`, `.goal-card`, `.input-shell`, or other DS globals
- [ ] No raw `--token-*` references, hex literals, or hardcoded px where a `--cds-size-*`
      exists
- [ ] Any display type preset is paired with its `-tracking` companion

## 3. Ask for changes

Each failure lands in one of four places. Deciding which one is the whole value of the test.

| Symptom | Where the fix goes |
| --- | --- |
| Unstyled output | `setup.md` plus non-negotiable 1 in `Guidelines.md` — the import rule is not prominent enough |
| Hand-rolled component | `components.md` — the "use for" column does not describe that use case in the words the prompt used |
| Unsplash imagery | Imagery section of `components.md` — add the asset key for the subject Make invented |
| Dark shell instead of branded | `styles.md` — strengthen the "not dark mode" wording |
| Invisible text on the shell | `styles.md` — the canvas recipe is not stated early enough |
| Light-on-light panel text | The island rule in `styles.md` — likely needs a wrong-versus-right code pair, not prose |
| Tailwind on DS components | Non-negotiable 3 in `Guidelines.md` — the always-loaded file is the only place this can be caught |
| Money strings, wrong tokens, missing tracking | `tokens.md`, or the Money section of `components.md` |
| Broken images, broken layout in correct code | **Package defect.** No guidelines wording can fix it — file it against the library |

Rule of thumb for the first eight: if the failure produces broken-looking output, the rule
belongs in the always-imported `Guidelines.md`; if it merely produces off-system output, the
detail file is enough.

The last row is the one worth watching for. The first run of this test produced two package
defects — absolute asset URLs and an appearance that flipped foregrounds without painting a
canvas — and in both cases Make had written correct code. If the generated code follows the
guidelines and the result is still wrong, stop editing the guidelines.

## 4. Follow-up prompts

Run these only once the primary passes.

- "Add a screen where they create a new goal — name, target amount, a category, and whether
  to round up purchases." Tests the form components, `SwitchField` over `Checkbox`, and the
  `error` prop.
- "Add the profile screen with their streak, badges, and linked accounts." Tests
  `SavingsStreak` day `name`, `BadgeCard`, and `AccountCard`.
- "Make the app blue instead of pink." Tests whether Make reaches for `brand="blue"` on
  `ThemeScope` rather than editing colors by hand.

## 5. Run log

| Date | Package | Guidelines | Failures |
| --- | --- | --- | --- |
| 2026-07-27 | 1.2.2 | initial split into 5 files | Demo images 404 (package); shell canvas unpainted, headings invisible (package); `Nav` unpositioned and unstyled (guidelines gap). Component selection, `demoAssets` usage, and `appearance="brand"` all correct. |
