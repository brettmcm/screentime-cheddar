// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4409-261
// source=src/components/avatar/Avatar.tsx
// component=Avatar
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('Size', {
  '40': '40',
  '32': '32',
  '24': '24',
})

export default {
  id: 'avatar',
  imports: ['import { Avatar } from "@screentime/cheddar-ds"'],
  // `src`/`name` are new in v1.2.0 — the component used to render bundled
  // artwork only. `name` also supplies the initials fallback.
  example: figma.code`<Avatar size="${size}" src={user.photoUrl} name={user.name} />`,
}
