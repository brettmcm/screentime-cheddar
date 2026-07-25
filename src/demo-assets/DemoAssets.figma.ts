// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4438-1362
// source=src/demo-assets/index.ts
// component=demoAssets
import figma from 'figma'

// `Chrome illustration` is the approved illustration set. It has no code
// component — the artwork ships as demo fixtures — so the snippet points at the
// manifest key instead, which is what a developer actually needs to reproduce
// the design.
const instance = figma.selectedInstance
const asset = instance.getEnum('Illustration', {
  Headphones: 'goals.headphones',
  Camera: 'goals.camera',
  Sneaker: 'goals.sneakers',
  Skateboard: 'goals.skateboard',
  Goggles: 'goals.goggles',
  Plane: 'goals.travel',
  Cake: 'celebration.cake',
  Party: 'celebration.party',
  'Sparkle 1': 'celebration.sparkle',
  'Sparkle 2': 'celebration.sparkleCluster',
  'Piggy Bank': 'articles.piggyBank',
  Burger: 'articles.expenses',
  Coin: 'brand.coin',
  'Coin 2': 'brand.coinDisc',
  Wallet: 'misc.wallet',
  'Pie Chart': 'misc.pieChart',
  Book: 'misc.book',
  Globe: 'misc.globe',
  'Question Mark': 'misc.question',
  // No dedicated artwork is bundled for Cursor; the question mark stands in.
  Cursor: 'misc.question',
})

export default {
  id: 'demo-assets-chrome-illustration',
  imports: ['import { demoAssets } from "@screentime/cheddar-ds/demo-assets"'],
  example: figma.code`<img src={demoAssets.${asset}} alt="" aria-hidden="true" />`,
  metadata: {
    nestable: true,
  },
}
