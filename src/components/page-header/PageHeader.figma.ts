// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5114-10696
// source=src/components/page-header/PageHeader.tsx
// component=PageHeader
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Variant', {
  Left: 'left',
  Center: 'center',
})

export default {
  id: 'page-header',
  imports: ['import { PageHeader } from "@screentime/cheddar-ds"'],
  example: figma.code`<PageHeader title="Header" variant="${variant}" />`,
}
