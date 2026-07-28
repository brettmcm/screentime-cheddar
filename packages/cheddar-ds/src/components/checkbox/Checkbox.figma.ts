// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2282
// source=src/components/checkbox/Checkbox.tsx
// component=Checkbox
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Label'
const description = instance.getString('Description') || 'Description'
const checked = instance.getBoolean('Selected')
const includeDescription = instance.getBoolean('Has Description')
const descriptionProp = includeDescription ? ` description="${description}"` : ''

export default {
  id: 'checkbox',
  imports: ['import { Checkbox } from "@screentime/cheddar-ds"'],
  example: figma.code`<Checkbox label="${label}"${descriptionProp} ${checked ? 'checked' : ''} />`,
}
