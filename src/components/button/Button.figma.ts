// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4404-2369
// source=src/components/button/Button.tsx
// component=Button
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label') || 'Button'
const icon = instance.getBoolean('Icon')
const variant = instance.getEnum('Variant', {
  Primary: 'primary',
  Secondary: 'secondary',
})
const size = instance.getEnum('Size', {
  Large: 'large',
  Medium: 'medium',
  Small: 'small',
})
const state = instance.getEnum('State', {
  Default: 'default',
  Disabled: 'disabled',
})
const disabled = state === 'disabled'

export default {
  id: 'button',
  imports: ['import { Button } from "./src/components"'],
  example: figma.code`<Button label="${label}" variant="${variant}" size="${size}" ${disabled ? 'disabled' : ''} ${icon ? 'showIcon' : ''} />`,
}
