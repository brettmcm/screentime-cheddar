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

/** iOS resource name -> the `demoAssets` entry it should mirror. */
const MAPPING = {
  'goal-headphones.png': demoAssets.goals.headphones,
  'goal-sneakers.png': demoAssets.goals.sneakers,
  'goal-goggles.png': demoAssets.goals.goggles,
}

for (const [target, src] of Object.entries(MAPPING)) {
  const from = `${DIST}/assets/${src.split('/').pop()}`
  if (!existsSync(from)) throw new Error(`missing design system asset: ${from}`)
  copyFileSync(from, `${RESOURCES}/${target}`)
  console.log(`${target} <- ${src}`)
}
