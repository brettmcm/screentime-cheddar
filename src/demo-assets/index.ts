/**
 * Demo imagery fixtures.
 *
 * These pictures exist so the gallery, docs, and consuming demos have realistic content
 * to render. They are NOT part of the themed component API: nothing here reacts to
 * `data-theme`, `data-brand`, or `data-appearance`, and no component reaches into this
 * module. Every component that renders an image takes it as a prop, so consumers are free
 * to pass their own artwork and ignore this module entirely.
 *
 * Data only — this module must stay free of React imports.
 *
 * Several keys intentionally resolve to the same file (for example `articles.creditCard`
 * and `misc.wallet`): the picture is shared, so we ship one copy of the bytes and point
 * both keys at it.
 */

import type { DemoAssetFile } from './verify'

import avatarLargePng from '../assets/demo/avatar-large.png'
import avatarMediumPng from '../assets/demo/avatar-medium.png'
import avatarSmallPng from '../assets/demo/avatar-small.png'
import bookPng from '../assets/demo/book.png'
import burgerPng from '../assets/demo/burger.png'
import cakePng from '../assets/demo/cake.png'
import cameraPng from '../assets/demo/camera.png'
import coinDiscPng from '../assets/demo/coin-disc.png'
import coinPng from '../assets/demo/coin.png'
import globePng from '../assets/demo/globe.png'
import headphonesPng from '../assets/demo/headphones.png'
import heroPng from '../assets/demo/hero.png'
import partyPopperPng from '../assets/demo/party-popper.png'
import pieChartPng from '../assets/demo/pie-chart.png'
import piggyBankPng from '../assets/demo/piggy-bank.png'
import planePng from '../assets/demo/plane.png'
import questionMarkPng from '../assets/demo/question-mark.png'
import skateboardPng from '../assets/demo/skateboard.png'
import skiGogglesPng from '../assets/demo/ski-goggles.png'
import sneakersPng from '../assets/demo/sneakers.png'
import sparkleClusterPng from '../assets/demo/sparkle-cluster.png'
import sparklePng from '../assets/demo/sparkle.png'
import storyFirstCardJpg from '../assets/demo/story-first-card.jpg'
import storyFriendsJpg from '../assets/demo/story-friends.jpg'
import walletPng from '../assets/demo/wallet.png'

/**
 * Bundler-resolved URL for every file in the canonical list. Typing this as
 * `Record<DemoAssetFile, string>` is the drift guard: a missing entry or a stray one is a
 * compile error against `verify.ts`.
 */
const sources: Record<DemoAssetFile, string> = {
  'avatar-large.png': avatarLargePng,
  'avatar-medium.png': avatarMediumPng,
  'avatar-small.png': avatarSmallPng,
  'book.png': bookPng,
  'burger.png': burgerPng,
  'cake.png': cakePng,
  'camera.png': cameraPng,
  'coin-disc.png': coinDiscPng,
  'coin.png': coinPng,
  'globe.png': globePng,
  'headphones.png': headphonesPng,
  'hero.png': heroPng,
  'party-popper.png': partyPopperPng,
  'pie-chart.png': pieChartPng,
  'piggy-bank.png': piggyBankPng,
  'plane.png': planePng,
  'question-mark.png': questionMarkPng,
  'skateboard.png': skateboardPng,
  'ski-goggles.png': skiGogglesPng,
  'sneakers.png': sneakersPng,
  'sparkle-cluster.png': sparkleClusterPng,
  'sparkle.png': sparklePng,
  'story-first-card.jpg': storyFirstCardJpg,
  'story-friends.jpg': storyFriendsJpg,
  'wallet.png': walletPng,
}

export const demoAssets = {
  /** Things a teen saves up for — the `Card / Goal` artwork. */
  goals: {
    headphones: sources['headphones.png'],
    sneakers: sources['sneakers.png'],
    skiTrip: sources['ski-goggles.png'],
    /** Same picture as `skiTrip`; kept because the app models this goal as `goggles`. */
    goggles: sources['ski-goggles.png'],
    skateboard: sources['skateboard.png'],
    camera: sources['camera.png'],
    travel: sources['plane.png'],
  },
  /** Learn-screen article illustrations. */
  articles: {
    piggyBank: sources['piggy-bank.png'],
    investing: sources['globe.png'],
    creditCard: sources['wallet.png'],
    emergencyFund: sources['coin.png'],
    expenses: sources['burger.png'],
    budgeting: sources['pie-chart.png'],
    learning: sources['book.png'],
    /** Photography for `Card / Customer Article`, not chrome illustration. */
    customerStory: sources['story-first-card.jpg'],
    communityStory: sources['story-friends.jpg'],
  },
  /** Goal Reached / milestone moments. */
  celebration: {
    goalReached: sources['party-popper.png'],
    /** Same picture as `goalReached`. */
    party: sources['party-popper.png'],
    cake: sources['cake.png'],
    sparkle: sources['sparkle.png'],
    sparkleCluster: sources['sparkle-cluster.png'],
  },
  /** Placeholder profile pictures, pre-sized to the `Avatar` sizes. */
  avatars: {
    small: sources['avatar-small.png'],
    medium: sources['avatar-medium.png'],
    large: sources['avatar-large.png'],
  },
  /** Cheddar-branded marketing imagery. */
  brand: {
    hero: sources['hero.png'],
    coin: sources['coin.png'],
    coinDisc: sources['coin-disc.png'],
  },
  /** Everything else, addressable by subject. */
  misc: {
    wallet: sources['wallet.png'],
    pieChart: sources['pie-chart.png'],
    book: sources['book.png'],
    globe: sources['globe.png'],
    question: sources['question-mark.png'],
  },
} as const

export type DemoAssets = typeof demoAssets

export type DemoAssetGroup = keyof DemoAssets

/** Dotted path to a single asset, e.g. `'goals.headphones'`. */
export type DemoAssetKey = {
  [Group in DemoAssetGroup]: `${Group}.${Extract<keyof DemoAssets[Group], string>}`
}[DemoAssetGroup]

export type DemoAssetEntry = {
  key: DemoAssetKey
  src: string
}

/** Every asset flattened for enumeration — used by the build check and the gallery. */
export const demoAssetList: readonly DemoAssetEntry[] = Object.entries(demoAssets).flatMap(
  ([group, entries]) =>
    Object.entries(entries as Record<string, string>).map(([name, src]) => ({
      key: `${group}.${name}` as DemoAssetKey,
      src,
    })),
)

export { demoAssetFiles, demoAssetDirectory, listExpectedAssetFiles } from './verify'
export type { DemoAssetFile } from './verify'
