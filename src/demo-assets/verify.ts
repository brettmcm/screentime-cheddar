/**
 * Verification helper for the demo asset manifest.
 *
 * The filename list itself lives in `./files.mjs` so that `scripts/check-demo-assets.mjs`
 * can read it straight from Node with no build step. This module is the typed view of
 * that list: dependency-free, no React, no `.png` imports, and importable from a plain
 * Node ESM script.
 */

import { demoAssetDirectory, demoAssetFiles } from './files.mjs'
import type { DemoAssetFile } from './files.mjs'

export { demoAssetDirectory, demoAssetFiles }
export type { DemoAssetFile }

/**
 * Source filenames the manifest expects on disk, relative to `demoAssetDirectory`.
 * Returns a fresh mutable array so callers can sort or filter it freely.
 */
export function listExpectedAssetFiles(): string[] {
  return [...demoAssetFiles]
}
