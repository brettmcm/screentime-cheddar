// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4456-1697
// source=src/components/notification/Notification.tsx
// component=Notification
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Property 1', {
  Default: 'default',
  Trend: 'trend',
  Opportunity: 'opportunity',
})

export default {
  id: 'notification',
  imports: ['import { Notification } from "./src/components"'],
  example: figma.code`<Notification variant="${variant}" />`,
}
