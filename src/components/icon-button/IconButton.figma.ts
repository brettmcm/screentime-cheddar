// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4378-1312
// source=src/components/icon-button/IconButton.tsx
// component=IconButton
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Variant', {
  Primary: 'primary',
  Neutral: 'neutral',
  Outline: 'outline',
})
const size = instance.getEnum('Size', {
  Medium: 'medium',
  Small: 'small',
})
const state = instance.getEnum('State', {
  Default: 'default',
  Disabled: 'disabled',
})
const disabled = state === 'disabled'

const iconSwap = instance.getInstanceSwap('Icon')
let iconName
if (iconSwap && iconSwap.type === 'INSTANCE') {
  iconName = iconSwap.executeTemplate().metadata?.props?.name
}

export default {
  id: 'icon-button',
  imports: ['import { IconButton } from "@screentime/cheddar-ds"'],
  example: figma.code`<IconButton variant="${variant}" size="${size}" ${disabled ? 'disabled' : ''} ${iconName ? `icon="${iconName}"` : ''} />`,
}
