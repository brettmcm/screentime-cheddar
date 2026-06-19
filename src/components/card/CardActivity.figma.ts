// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4735-4685
// source=src/components/card/Card.tsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const contents = instance.getSlot('contents')

export default {
  id: 'card-activity',
  imports: ['import { Card } from "@screentime/cheddar-ds"'],
  example: figma.code`<Card variant="activity-feed">${contents}</Card>`,
  metadata: {
    nestable: false,
  },
}
