// Types for files.mjs. The tuple must mirror the array in files.mjs exactly — see the
// note there for how the two halves are guarded.

export declare const demoAssetFiles: readonly [
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

export type DemoAssetFile = (typeof demoAssetFiles)[number]

export declare const demoAssetDirectory: 'src/assets/demo'
