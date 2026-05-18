// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2249
// source=src/components/input-field/InputField.tsx
// component=InputField
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Label'
const value = instance.getString('Value') || 'Value'
const description = instance.getString('Description') || 'Description'
const dropdown = instance.getBoolean('Dropdown')
const showLabel = instance.getBoolean('Show Label')
const includeDescription = instance.getBoolean('Has Description')
const descriptionProp = includeDescription ? ` description="${description}"` : ''

export default {
  id: 'input-field',
  imports: ['import { InputField } from "./src/components"'],
  example: figma.code`<InputField label="${label}" value="${value}"${descriptionProp} ${dropdown ? 'dropdown' : ''} ${showLabel ? '' : 'showLabel={false}'} />`,
}
