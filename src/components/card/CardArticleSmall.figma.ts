// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5209-18521
// source=src/components/card/Card.tsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Content', {
  Credit: 'article-small-credit',
  Expenses: 'article-small-expenses',
  '50/30': 'article-small-fifty-thirty',
  Emergency: 'article-small-emergency',
})

export default {
  id: 'card-article-small',
  imports: ['import { Card } from "./src/components"'],
  example: figma.code`<Card variant="${variant}" />`,
}
