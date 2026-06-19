// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5211-24034
// source=src/components/card/Card.tsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Property 1', {
  'Finance Nerd': 'badge-finance-nerd',
  'Double Down': 'badge-double-down',
  'Stack Master': 'badge-stack-master',
})

export default {
  id: 'card-badges',
  imports: ['import { Card } from "@screentime/cheddar-ds"'],
  example: figma.code`<Card variant="${variant}" />`,
}
