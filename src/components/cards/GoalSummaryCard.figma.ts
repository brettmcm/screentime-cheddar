// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5216-2340
// source=src/components/cards/GoalSummaryCard.tsx
// component=GoalSummaryCard
import figma from 'figma'

export default {
  id: 'goal-summary-card',
  imports: ['import { GoalSummaryCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<GoalSummaryCard
  items={[
    { label: 'Headphones', amount: 76.5 },
    { label: 'Sneakers', amount: 100 },
    { label: 'Ski Trip', amount: 18.2 },
  ]}
  totalLabel="Total savings"
/>`,
}
