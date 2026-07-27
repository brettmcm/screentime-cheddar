# Theming and styling

## Theming

Theming is three independent axes, applied by `ThemeScope` as data attributes. Every layer
only redefines CSS custom properties, so scopes nest and the nearest ancestor wins.

| Axis | Prop | Values | Default |
| --- | --- | --- | --- |
| Color scheme | `scheme` | `light`, `dark` | `light` |
| Brand ramp | `brand` | `magenta`, `blue`, `green`, `purple` | `magenta` |
| Appearance | `appearance` | `surface`, `brand` | `surface` |

**Cheddar product screens use `appearance="brand"`.** That is the app shell: a saturated
`--cds-color-brand-100` canvas carrying light cards. It is *not* dark mode — do not reach for
`scheme="dark"` to get the branded look.

**The shell must paint its canvas.** `ThemeScope` only sets data attributes; it does not
paint anything. Each appearance redefines `--cds-color-background-default` and the foreground
that pairs with it, but something has to apply them. Add `className="cds-app-canvas"` to the
outermost scope, which paints the canvas, its foreground, and a full-viewport height:

```tsx
<ThemeScope appearance="brand" className="cds-app-canvas">
  {/* app shell */}
</ThemeScope>
```

Skipping this is the single worst failure mode in the system: `appearance="brand"` flips the
foregrounds to light *and* leaves the canvas white, so every heading and link outside a card
becomes white text on white. The screen looks half-empty rather than obviously broken.

Use `appearance="surface"` for plain white or light contexts such as marketing pages and
embedded views. Use `scheme="dark"` only when the request is genuinely about dark mode. Both
still want `cds-app-canvas` on the outermost scope.

`ThemeScope` renders a `<div>` by default; pass `as` for a different element, plus
`className` and `style` for your own layout.

## The island rule

On the branded canvas, foreground tokens are tuned for a dark canvas. If you group content
onto your own light panel, wrap it so it declares its own scheme — otherwise you get
light-on-light text:

```tsx
<ThemeScope appearance="brand">
  <TotalSavingsCard amount={194.7} showLogo />
  <ThemeScope scheme="light">
    <SectionHeader title="Recent activity" as="h3" />
    <ActivityItem type="deposit" time="Today, 1:34pm" amount="$20.00" />
  </ThemeScope>
</ThemeScope>
```

Components that paint their own surface (`GoalCard`, `AccountCard`, `ArticleCard`,
`SavingsStreak`, `SpendingChartPanel`, `GoalSummaryCard`, `ActivityCard`) already handle
this internally. The island wrapper is only for panels *you* build.

## Styling boundaries

Class names in this library are unprefixed globals — `.btn`, `.goal-card`, `.input-shell`,
`.nav-icon`, `.article-card`. Treat them as private:

- Do not write CSS that targets them. Your rule will leak into every instance.
- Do not apply Tailwind utilities to a DS component.
- Do not pass `className` to a DS component to change how it looks. Passing a class for
  layout position is fine; restyling its interior is not.

Change appearance through props (`variant`, `size`, `accent`, `appearance`) instead. If a
prop does not exist for what you need, the design does not support it.

## Layout

There is no layout grid component. Compose with your own flex or grid containers, sized with
`--cds-size-gap-*` and `--cds-size-padding-*` (see `tokens.md`).

Components own their internals and nothing else — none of them position themselves. `Nav` in
particular is a row of controls with no background, no width limit, and no positioning, so
placing it is your job:

```tsx
<div style={{
  position: 'sticky',
  bottom: 0,
  maxWidth: 430,
  margin: '0 auto',
  padding: 'var(--cds-size-padding-s)',
  background: 'var(--cds-color-background-default)',
}}>
  <Nav activeItem="home" showLabels onItemSelect={goTo} onAddSelect={openAddFunds} />
</div>
```

Wrapping a component in a container you style is fine, and is how you place anything. What is
off limits is styling the component's own interior — see the boundaries above. Left
unwrapped, `Nav` lands wherever the document flow puts it and its inactive icons sit on
whatever is behind them.

`Nav` does render a home indicator bar at its foot. No iOS status bar ships with the library,
so supply top safe-area padding yourself.

## Building your own container

Rare, but if a layout genuinely has no matching component, a custom surface must declare
both halves of the pairing — background *and* foreground. It must also declare the icon
knockout if a two-tone icon (`receive`, `send`, `transfer`, `deposit`, `withdraw`) sits on
it, otherwise the glyph's counter shape is painted the wrong color:

```css
.my-panel {
  background: var(--cds-color-background-surface);
  color: var(--cds-color-foreground-on-surface);
  border-radius: var(--cds-size-corner-medium);
  padding: var(--cds-size-padding-m);
  box-shadow: var(--cds-shadow-surface);
  --cds-icon-knockout: var(--cds-color-background-surface);
}
```

`--cds-color-foreground-on-surface` is the surface pairing;
`--cds-color-foreground-primary` is the canvas pairing. Getting this backwards is what
produces white text on a white card under `appearance="brand"`.
