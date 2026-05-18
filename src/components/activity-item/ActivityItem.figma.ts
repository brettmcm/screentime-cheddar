// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4441-631&t=dsZZMCRqT4nyf9E1-1
// source=src/components/activity-item/ActivityItem.tsx
// component=ActivityItem
import figma from 'figma'

const instance = figma.selectedInstance
const type = instance.getEnum('Type', {
  Deposit: 'deposit',
  Withdrawal: 'withdrawal',
})
const activityValue = instance.getString('activityValue').replace(/^-/, '')
const activityDate = instance.getString('activityDate')
const activityTime = instance.getString('activityTime')

export default {
  id: 'activity-item',
  imports: ['import { ActivityItem } from "./src/components"'],
  example: figma.code`<ActivityItem type="${type}" time="${activityDate}, ${activityTime}" amount="${activityValue}" />`,
  metadata: {
    nestable: false,
  },
}
