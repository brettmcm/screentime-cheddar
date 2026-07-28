// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5185-2262
// source=src/components/search/Search.tsx
// component=Search
import figma from 'figma'

const instance = figma.selectedInstance
const text = instance.getString('Value') || 'Search anything'

// `State` was unmapped before v1.2.0, so the `Placeholder` state emitted the
// placeholder copy as a real `value` — a search field pre-filled with the words
// "Search anything". The two states are placeholder vs. value, not styling.
const active = instance.getEnum('State', {
  Placeholder: false,
  Active: true,
})

export default {
  id: 'search',
  imports: ['import { Search } from "@screentime/cheddar-ds"'],
  example: active
    ? figma.code`<Search value="${text}" onValueChange={setQuery} />`
    : figma.code`<Search placeholder="${text}" value={query} onValueChange={setQuery} />`,
}
