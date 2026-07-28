// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4991-6585
// source=src/components/text-link/TextLink.tsx
// component=TextLink
import figma from 'figma'

const instance = figma.selectedInstance
// `Text Link` exposes no component properties — the label lives in a text layer.
const labelHandle = instance.findText('Label')
const label = labelHandle.type === 'TEXT' ? labelHandle.textContent : 'View all'

export default {
  id: 'text-link',
  imports: ['import { TextLink } from "@screentime/cheddar-ds"'],
  example: figma.code`<TextLink onClick={() => {}}>${label}</TextLink>`,
  metadata: {
    nestable: true,
  },
}
