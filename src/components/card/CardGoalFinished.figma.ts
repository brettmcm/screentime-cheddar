// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5211-23708
// source=src/components/card/Card.tsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Property 1', {
  Finished: 'goal-finished',
  Variant2: 'goal-finished-variant-2',
  Variant3: 'goal-finished-variant-3',
})

export default {
  id: 'card-goal-finished',
  imports: ['import { Card } from "./src/components"'],
  example: figma.code`<Card variant="${variant}" />`,
}
