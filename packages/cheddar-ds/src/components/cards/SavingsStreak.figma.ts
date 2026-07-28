// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4995-9705
// source=src/components/cards/SavingsStreak.tsx
// component=SavingsStreak
import figma from 'figma'

// `Savings Streak` has no component properties — the filled/hollow state of each
// day is set on the instance, so the snippet ships the Profile-screen shape and
// the developer supplies real data.
export default {
  id: 'savings-streak',
  imports: ['import { SavingsStreak } from "@screentime/cheddar-ds"'],
  example: figma.code`<SavingsStreak
  title="Savings Streak"
  days={[
    { label: 'S', name: 'Sunday', complete: true },
    { label: 'M', name: 'Monday', complete: true },
    { label: 'T', name: 'Tuesday', complete: true },
    { label: 'W', name: 'Wednesday' },
    { label: 'T', name: 'Thursday', complete: true },
    { label: 'F', name: 'Friday', complete: true },
    { label: 'S', name: 'Saturday' },
  ]}
/>`,
}
