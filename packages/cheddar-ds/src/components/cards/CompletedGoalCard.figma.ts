// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5211-23708
// source=src/components/cards/CompletedGoalCard.tsx
// component=CompletedGoalCard
import figma from 'figma'

const instance = figma.selectedInstance
const fallback = {
  name: 'Skateboard',
  amount: 120,
  accent: 'magenta',
  asset: 'goals.skateboard',
}
const goal =
  instance.getEnum('Property 1', {
    Finished: fallback,
    Variant2: { name: 'Camera', amount: 260, accent: 'blue', asset: 'goals.camera' },
    Variant3: { name: 'Art Book', amount: 80, accent: 'purple', asset: 'misc.book' },
  }) ?? fallback

export default {
  id: 'completed-goal-card',
  imports: [
    'import { CompletedGoalCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<CompletedGoalCard
  name="${goal.name}"
  amount={${goal.amount}}
  accent="${goal.accent}"
  image={demoAssets.${goal.asset}}
/>`,
}
