// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5187-438
// source=src/components/tag/Tag.tsx
// component=Tag
import figma from 'figma'

const instance = figma.selectedInstance
const color = instance.getEnum('Color', {
  Green: 'green',
  Blue: 'blue',
  Magenta: 'magenta',
  Purple: 'purple',
})
const labelHandle = instance.findText('Label')
const label = labelHandle.type === 'TEXT' ? labelHandle.textContent : 'Label'

export default {
  id: 'tag',
  imports: ['import { Tag } from "@screentime/cheddar-ds"'],
  example: figma.code`<Tag label="${label}" color="${color}" />`,
}
