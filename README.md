# Cheddar App

Multi-platform Cheddar product demo aligned with the shared [`@screentime/cheddar-ds`](https://github.com/figma/screentime-cheddar-ds) design system.

## Repository layout

| Path | Purpose |
| --- | --- |
| `packages/cheddar-tokens/` | Canonical DTCG token JSON and generated platform bindings. |
| `apps/ios/` | Native SwiftUI app + local `CheddarDS` Swift package (DS components & theme). |
| `apps/android/` | Reserved for the native Kotlin/Jetpack Compose app. |
| `apps/web/` | Mobile-optimized React web app (Vite + `@screentime/cheddar-ds`). |

Design tokens and semantic color names mirror the web DS (`--cds-*` / `--token-color-*`). Platform code should consume `packages/cheddar-tokens` or the npm package—not duplicate hex values.

## iOS

See [apps/ios/README.md](apps/ios/README.md). Quick path:

```sh
pip install -r scripts/requirements-fonts.txt
npm run codegen
npm run ios:generate
npm run ios:build
```

## Web

```sh
npm install
npm run dev --workspace apps/web
```

The web app is responsive React optimized for a mobile viewport. It is not a
device mockup and must not render hardware frames, rounded device corners,
status bars, or other operating-system chrome.

## Android

The Android target will be implemented natively with Kotlin and Jetpack Compose.
See [apps/android/README.md](apps/android/README.md).

## Figma reference

- App screens: `Learning-Lab-Demos` → **App Flow** (`125:1363`)
- Components & tokens: Cheddar Product DS via `@screentime/cheddar-ds`
