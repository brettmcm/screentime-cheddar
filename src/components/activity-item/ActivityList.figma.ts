// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4735-4685
// source=src/components/activity-item/ActivityItem.tsx
// component=ActivityItem
import figma from 'figma'

// `Card / Activity` is a surface with a `contents` slot holding Activity Item
// instances. There is no dedicated React component for the wrapper — the
// recommended shape is a surface you own composed from `ActivityItem`, which is
// what this snippet emits. The old mapping pointed at
// `<Card variant="activity-feed">`, which is deprecated.
const contents = figma.properties.children(['contents'])

export default {
  id: 'activity-list',
  imports: ['import { ActivityItem } from "@screentime/cheddar-ds"'],
  example: figma.code`<ul className="activity-list">
  ${contents}
</ul>`,
}
