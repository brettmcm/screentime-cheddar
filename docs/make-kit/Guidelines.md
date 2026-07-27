# Cheddar Design System guidelines

`@screentime/cheddar-ds` is the component library for Cheddar, a teen savings app. Build
every screen from its components. These guidelines are the contract — where they disagree
with a general React or Tailwind habit, follow these guidelines.

## Where to look

| File | Read it before |
| --- | --- |
| `setup.md` | Installing the package or wiring up a new project |
| `styles.md` | Theming a screen, or writing any CSS of your own |
| `tokens.md` | Choosing a color, size, radius, shadow, or type style |
| `components.md` | Building any UI — the full component reference and screen recipe |

## Non-negotiables

1. **Import the stylesheet once.** Nothing renders correctly without it. The JS bundle does
   not import CSS, so this is a silent failure — components appear as unstyled markup.

   ```tsx
   // App entry, exactly once
   import '@screentime/cheddar-ds/styles.css'
   ```

2. **Never re-implement a component that exists here.** No hand-rolled buttons, cards,
   inputs, or bottom sheets. If a shape looks close but not exact, it is almost always a
   prop on the existing component rather than a new component. See `components.md`.

3. **Never restyle a component's internals.** Class names in this library are unprefixed
   globals (`.btn`, `.goal-card`, `.input-shell`, `.nav-icon`). Do not target them, do not
   apply Tailwind utilities to a DS component, and do not pass `className` to override its
   look. Wrapping a component in a container you style is fine — that is how you position
   things, since no component positions itself. Changing its interior is not.

4. **There is no `Card` component.** It was removed. Use the card that matches your shape,
   listed in `components.md`.

5. **Cheddar product screens use
   `<ThemeScope appearance="brand" className="cds-app-canvas">`.** That is the app shell. It
   is not dark mode, and `ThemeScope` paints nothing on its own — without `cds-app-canvas`
   the canvas stays white while the text turns white with it. Details in `styles.md`.

6. **Use semantic `--cds-*` tokens, never the `--token-*` primitives.** Primitives ignore
   theming. Reference in `tokens.md`.

7. **Do not add fonts.** Mona Sans Variable and Oswald ship inside the package and are
   wired up by the stylesheet. No Google Fonts link, no `font-family` declarations.

## Do not

1. **Do not skip `import '@screentime/cheddar-ds/styles.css'`.** Everything looks broken and
   the cause is invisible.
2. **Do not write `<Card variant="…">`.** It does not exist. Use the card for your shape.
3. **Do not use `--token-color-*` primitives.** They ignore theming. Use `--cds-*`.
4. **Do not apply Tailwind utilities or custom CSS to DS components**, and do not target
   their class names — they are unprefixed globals and your rule will leak.
5. **Do not use `scheme="dark"` to get the branded app look.** That is
   `appearance="brand"`.
6. **Do not render a shell without `className="cds-app-canvas"`** on the outermost
   `ThemeScope`. Unpainted canvas plus flipped foregrounds means invisible text.
7. **Do not leave `Nav` unpositioned.** Wrap it in a sticky, width-constrained container.
8. **Do not use a display type preset without its `-tracking` companion.**
9. **Do not hardcode pixel values** where a `--cds-size-*` token exists.
10. **Do not invent icon names** outside the `IconName` union.
11. **Do not use external or placeholder image URLs.** Use `demoAssets`.
12. **Do not pass pre-formatted money strings** like `"$76.50"` when a number will do —
    the card formats and splits the cents itself.
13. **Do not set `font-family` or load web fonts.** The package ships its own.
14. **Do not build a bottom sheet, keypad, tab bar, or progress card by hand.** `Sheet`,
    `NumberPad`, `Nav`, and the card components exist.
15. **Do not put a light panel on the branded canvas without wrapping it** in
    `<ThemeScope scheme="light">`.
