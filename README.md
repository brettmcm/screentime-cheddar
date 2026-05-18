# Cheddar Design System (cds)

React 19 + TypeScript + Vite component library for the Cheddar product, with Figma Code Connect wired up against the [Cheddar Product Design System](https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC) file.

## Getting started

```sh
npm install
cp .env.example .env.local   # then fill in FIGMA_ACCESS_TOKEN
npm run dev
```

Open the dev server URL printed in the terminal to see the component gallery.

## Environment

This repo reads secrets from `.env.local` (gitignored). See [.env.example](.env.example) for the full list.

| Variable | Required for | How to obtain |
| --- | --- | --- |
| `FIGMA_ACCESS_TOKEN` | `npm run figma:*` (Code Connect publish, URL sync) | [Figma → Settings → Personal access tokens](https://www.figma.com/settings). Scopes: **File content (read)** + **Code Connect (write)**. |

`npm run dev`, `npm run build`, and `npm run lint` do **not** require any env vars.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with the component gallery. |
| `npm run build` | Type-check (`tsc -b`) then produce a production build in `dist/`. |
| `npm run lint` | Run ESLint across the repo. |
| `npm run figma:check-urls` | Verify every `.figma.ts` file points to a node that still exists in the Figma file. |
| `npm run figma:url-sync` | Refresh stale node URLs in `.figma.ts` files. |
| `npm run figma:publish` | Publish Code Connect mappings to the Figma file. Runs `figma:url-sync` first. |
| `npm run figma:publish:dry-run` | Same as above but no upload — useful for previewing the diff. |
| `npm run figma:unpublish` | Remove Code Connect mappings from the Figma file. |

---

## Template notes

The sections below are from the original Vite + React template and apply to broader configuration tuning.

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
