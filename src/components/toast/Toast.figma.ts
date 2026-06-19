// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=7008-475
// source=src/components/toast/Toast.tsx
// component=Toast
import figma from 'figma'

const instance = figma.selectedInstance
const messageHandle = instance.findText('Message')
const message =
  messageHandle.type === 'TEXT'
    ? messageHandle.textContent
    : 'Action completed successfully'

export default {
  id: 'toast',
  imports: ['import { Toast } from "@screentime/cheddar-ds"'],
  example: figma.code`<Toast message="${message}" />`,
}
