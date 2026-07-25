# Cheddar iOS

SwiftUI app implementing the **App Flow** frames from Learning Lab Demos, with UI built from the local **CheddarDS** package (Swift mirror of `@screentime/cheddar-ds` tokens and components).

## Generate Xcode project

```sh
cd apps/ios
xcodegen generate   # or: npm run ios:generate from repo root
open Cheddar.xcodeproj
```

Requires full **Xcode**. Use an available simulator (e.g. iPhone 17). CLI build:

```sh
npm run ios:build
```

## Fonts & tokens

Mona Sans (Medium/SemiBold/Bold) and Oswald (Regular/Medium/SemiBold) are instantiated from `@screentime/cheddar-ds` woff2 files into static TTFs with correct PostScript names (`MonaSans-Medium`, `Oswald-SemiBold`, etc.).

They load two ways:
1. **App target** — `CheddarApp/Resources/Fonts/` + `UIAppFonts` in `Info.plist`
2. **CheddarDS package** — `CTFontManagerRegisterFontsForURL` at launch (searches bundle root; SPM flattens `Fonts/`)

After updating `@screentime/cheddar-ds`:

```sh
pip install -r scripts/requirements-fonts.txt   # once
npm run codegen
cp apps/ios/Packages/CheddarDS/Sources/CheddarDS/Resources/Fonts/*.ttf apps/ios/CheddarApp/Resources/Fonts/
```

## App icon

The icon is exported from Figma (Cheddar Product Design System, node `4378:1178`) and kept as
vector source at `scripts/assets/app-icon.svg`. To re-rasterize the asset catalog:

```sh
npm run generate:appicon
```

The artwork is stored full-bleed because iOS applies its own rounded-corner mask, and the PNGs are
written without an alpha channel, which app icons require.

## Structure

| Path | Role |
| --- | --- |
| `CheddarApp/` | App targets, screens, navigation, demo content |
| `Packages/CheddarDS/` | Design tokens + reusable SwiftUI components |

Semantic aliases for the app live in `CheddarColors.swift` / `CheddarSpacing.swift` on top of
`Theme/Generated/CheddarTokens.swift`, which is vendored from the design system by
`npm run sync:swift`.
