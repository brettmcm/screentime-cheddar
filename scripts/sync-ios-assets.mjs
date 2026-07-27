/**
 * Copies shared demo artwork out of the design system into the iOS bundle.
 *
 * iOS was carrying its own hand-exported copies of the goal shots, and they had
 * been flattened onto an opaque background — invisible while the artwork sat on
 * a solid tile, obvious the moment it had to sit on the brand illustration.
 * Pulling the bytes from `demoAssets` keeps the two platforms on the same
 * picture; the DS filenames are content-hashed, so resolve them through the
 * exported map rather than hard-coding them.
 */
import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import { copyFileSync, existsSync } from 'node:fs'

const DIST = 'node_modules/@screentime/cheddar-ds/dist'
const RESOURCES = 'apps/ios/Packages/CheddarDS/Sources/CheddarDS/Resources'

/**
 * iOS resource name -> the `demoAssets` entry it should mirror.
 *
 * The set matches what the app actually renders: every goal illustration the
 * add-goal picker offers, every article that ships in `state/data.ts`, and the
 * avatars, hero and celebration artwork the screens reference by name.
 */
const MAPPING = {
  'goal-headphones.png': demoAssets.goals.headphones,
  'goal-sneakers.png': demoAssets.goals.sneakers,
  'goal-goggles.png': demoAssets.goals.goggles,
  'goal-travel.png': demoAssets.goals.travel,
  'goal-skateboard.png': demoAssets.goals.skateboard,
  'goal-camera.png': demoAssets.goals.camera,

  'article-piggy-bank.png': demoAssets.articles.piggyBank,
  'article-investing.png': demoAssets.articles.investing,
  'article-credit-card.png': demoAssets.articles.creditCard,
  'article-emergency-fund.png': demoAssets.articles.emergencyFund,
  'article-expenses.png': demoAssets.articles.expenses,
  'article-budgeting.png': demoAssets.articles.budgeting,
  'article-customer-story.jpg': demoAssets.articles.customerStory,
  'article-community-story.jpg': demoAssets.articles.communityStory,

  'celebration-goal-reached.png': demoAssets.celebration.goalReached,

  // `Notification` picks its own illustration per variant rather than taking one as a prop,
  // so these are named for the variant, not the subject.
  'notification-default.png': demoAssets.articles.piggyBank,
  'notification-trend.png': demoAssets.misc.pieChart,
  'notification-opportunity.png': demoAssets.brand.coinDisc,

  'avatar-small.png': demoAssets.avatars.small,
  'avatar-medium.png': demoAssets.avatars.medium,
  'avatar-large.png': demoAssets.avatars.large,

  'brand-hero.png': demoAssets.brand.hero,
}

for (const [target, src] of Object.entries(MAPPING)) {
  const from = `${DIST}/assets/${src.split('/').pop()}`
  if (!existsSync(from)) throw new Error(`missing design system asset: ${from}`)
  copyFileSync(from, `${RESOURCES}/${target}`)
  console.log(`${target} <- ${src}`)
}
