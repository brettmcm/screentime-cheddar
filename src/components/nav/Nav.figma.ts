// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4991-8505
// source=src/components/nav/Nav.tsx
// component=Nav
import figma from 'figma'

const instance = figma.selectedInstance
const activeItem = instance.getEnum('Property 1', {
  Home: 'home',
  Wallet: 'wallet',
  Learn: 'learn',
  Profile: 'profile',
}) || 'home'

export default {
  id: 'bottom-nav',
  imports: ['import { Nav } from "./src/components"'],
  example: figma.code`<Nav activeItem="${activeItem}" />`,
}
