// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4456-1697
// source=src/components/notification/Notification.tsx
// component=Notification
import figma from 'figma'

const instance = figma.selectedInstance
// The Figma property is `Type`, not `Property 1` — reading the wrong name
// silently yielded undefined and emitted `<Notification variant="" />`.
const variant = instance.getEnum('Type', {
  Default: 'default',
  Trend: 'trend',
  Opportunity: 'opportunity',
})
const showDismiss = instance.getBoolean('Close button')

export default {
  id: 'notification',
  imports: ['import { Notification } from "@screentime/cheddar-ds"'],
  example: figma.code`<Notification variant="${variant}"${showDismiss ? '' : ' showDismiss={false}'} />`,
}
