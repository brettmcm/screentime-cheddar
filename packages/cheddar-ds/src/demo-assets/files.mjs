// Canonical list of the image files that the demo asset manifest expects to find in
// src/assets/demo/.
//
// This is plain ESM on purpose: scripts/check-demo-assets.mjs imports it directly from
// Node with no build step, while the TypeScript manifest reads it through files.d.mts.
// Keep the literals here and the tuple in files.d.mts in sync — src/demo-assets/index.ts
// keys a Record on that tuple, so a type-side mismatch fails `tsc` and a disk-side
// mismatch fails the asset check.

export const demoAssetFiles = [
  'avatar-large.png',
  'avatar-medium.png',
  'avatar-small.png',
  'book.png',
  'burger.png',
  'cake.png',
  'camera.png',
  'coin-disc.png',
  'coin.png',
  'globe.png',
  'headphones.png',
  'hero.png',
  'party-popper.png',
  'pie-chart.png',
  'piggy-bank.png',
  'plane.png',
  'question-mark.png',
  'skateboard.png',
  'ski-goggles.png',
  'sneakers.png',
  'sparkle-cluster.png',
  'sparkle.png',
  'story-first-card.jpg',
  'story-friends.jpg',
  'wallet.png',
]

/** Directory the files above live in, relative to the package root. */
export const demoAssetDirectory = 'src/assets/demo'
