// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5211-21545
// source=src/components/cards/ProfileCard.tsx
// component=ProfileCard
import figma from 'figma'

const instance = figma.selectedInstance
const nameHandle = instance.findText('Name')
const name = nameHandle.type === 'TEXT' ? nameHandle.textContent : 'Jamie K.'
const handleHandle = instance.findText('Handle')
const handle = handleHandle.type === 'TEXT' ? handleHandle.textContent : '@jamieh'

export default {
  id: 'profile-card',
  imports: [
    'import { ProfileCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<ProfileCard
  name="${name}"
  handle="${handle}"
  avatarSrc={demoAssets.avatars.large}
  actions={[
    { label: 'Edit', onClick: () => {} },
    { label: 'Share', onClick: () => {} },
  ]}
/>`,
}
