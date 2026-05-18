// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2269
// source=src/components/switch-field/SwitchField.tsx
// component=SwitchField
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Label'
const description = instance.getString('Description') || 'Description'
const checked = instance.getBoolean('Selected')
const showLabel = instance.getBoolean('Show Label')
const includeDescription = instance.getBoolean('Has Description')
const descriptionProp = includeDescription ? ` description="${description}"` : ''

export default {
  id: 'switch-field',
  imports: ['import { SwitchField } from "./src/components"'],
  example: figma.code`<SwitchField label="${label}"${descriptionProp} ${checked ? 'checked' : ''} ${showLabel ? '' : 'showLabel={false}'} />`,
}
