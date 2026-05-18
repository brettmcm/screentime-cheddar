// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2243
// source=src/components/textarea/Textarea.tsx
// component=Textarea
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Label'
const value = instance.getString('Value') || 'Value'
const description = instance.getString('Description') || 'Description'
const showLabel = instance.getBoolean('Show Label')
const includeDescription = instance.getBoolean('Has Description')
const descriptionProp = includeDescription ? ` description="${description}"` : ''

export default {
  id: 'textarea',
  imports: ['import { Textarea } from "./src/components"'],
  example: figma.code`<Textarea label="${label}" value="${value}"${descriptionProp} ${showLabel ? '' : 'showLabel={false}'} />`,
}
