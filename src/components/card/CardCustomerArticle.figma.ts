// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5209-18225
// source=src/components/card/Card.tsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Content', {
  'Credit Card': 'customer-article-credit-card',
  Friends: 'customer-article-friends',
})

export default {
  id: 'card-customer-article',
  imports: ['import { Card } from "./src/components"'],
  example: figma.code`<Card variant="${variant}" />`,
}
