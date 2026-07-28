// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5114-10696
// source=src/components/page-header/PageHeader.tsx
// component=PageHeader
import figma from 'figma'

const instance = figma.selectedInstance
const align = instance.getEnum('Variant', {
  Left: 'left',
  Center: 'center',
})
const titleHandle = instance.findText('Title')
const title = titleHandle.type === 'TEXT' ? titleHandle.textContent : 'Header'

export default {
  id: 'page-header',
  imports: ['import { PageHeader } from "@screentime/cheddar-ds"'],
  // `onBack` makes the back control live rather than decorative.
  example: figma.code`<PageHeader title="${title}" align="${align}" onBack={() => goBack()} />`,
}
