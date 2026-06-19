// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=7041-13118
// source=src/components/empty-state/EmptyState.tsx
// component=EmptyState
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Property 1', {
  Error: 'error',
})
const titleHandle = instance.findText('Title')
const title =
  titleHandle.type === 'TEXT' ? titleHandle.textContent : 'Something went wrong'
const descriptionHandle = instance.findText('Description')
const description =
  descriptionHandle.type === 'TEXT'
    ? descriptionHandle.textContent
    : 'Refresh or try again'

export default {
  id: 'empty-state',
  imports: ['import { EmptyState } from "@screentime/cheddar-ds"'],
  example: figma.code`<EmptyState variant="${variant}" title="${title}" description="${description}" />`,
}
