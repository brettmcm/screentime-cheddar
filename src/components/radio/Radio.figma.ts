// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2299
// source=src/components/radio/Radio.tsx
// component=Radio
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Label'
const description = instance.getString('Description') || 'Description'
const checked = instance.getBoolean('Selected')
const includeDescription = instance.getBoolean('Has Description')
const descriptionProp = includeDescription ? ` description="${description}"` : ''

export default {
  id: 'radio',
  imports: ['import { Radio } from "./src/components"'],
  example: figma.code`<Radio label="${label}"${descriptionProp} ${checked ? 'checked' : ''} />`,
}
