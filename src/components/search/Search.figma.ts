// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2262
// source=src/components/search/Search.tsx
// component=Search
import figma from 'figma'

const instance = figma.selectedInstance
const value = instance.getString('Value') || 'Search anything'

export default {
  id: 'search',
  imports: ['import { Search } from "@screentime/cheddar-ds"'],
  example: figma.code`<Search value="${value}" />`,
}
