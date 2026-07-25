// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4438-4323
// source=src/components/cards/GoalCard.tsx
// component=GoalCard
import figma from 'figma'

// `Card / Goal` is the most-instanced card in the product file (81 uses) and had
// no Code Connect mapping before v1.2.0 — designers got no snippet at all.
const instance = figma.selectedInstance
const fallback = {
  name: 'Headphones',
  target: 280,
  saved: 76.5,
  accent: 'magenta',
  asset: 'goals.headphones',
  complete: false,
}
const goal =
  instance.getEnum('Variant', {
    Headphones: fallback,
    Sneakers: {
      name: 'Sneakers',
      target: 120,
      saved: 100,
      accent: 'purple',
      asset: 'goals.sneakers',
      complete: false,
    },
    'Ski Trip': {
      name: 'Freshman Trip',
      target: 500,
      saved: 18.2,
      accent: 'green',
      asset: 'goals.skiTrip',
      complete: false,
    },
    'Goal reached': {
      name: 'Camera',
      target: 500,
      saved: 500,
      accent: 'blue',
      asset: 'goals.camera',
      complete: true,
    },
  }) ?? fallback

export default {
  id: 'goal-card',
  imports: [
    'import { GoalCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<GoalCard
  name="${goal.name}"
  target={${goal.target}}
  saved={${goal.saved}}
  accent="${goal.accent}"
  image={demoAssets.${goal.asset}}
  ${goal.complete ? 'complete' : ''}
  onClick={() => {}}
/>`,
}
