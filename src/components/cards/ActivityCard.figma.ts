// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4735-4685
// source=src/components/cards/ActivityCard.tsx
// component=ActivityCard
import figma from 'figma'

// `Card / Activity` is a surface with a `contents` slot holding Activity Item
// instances, which is exactly the shape `ActivityCard` takes.
const contents = figma.properties.children(['contents'])

export default {
  id: 'activity-card',
  imports: ['import { ActivityCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<ActivityCard>
  ${contents}
</ActivityCard>`,
}
