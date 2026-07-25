// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5211-24034
// source=src/components/cards/BadgeCard.tsx
// component=BadgeCard
import figma from 'figma'

// Captions come from Figma. The v1.1.0 `Card` registry had drifted from the
// design for two of the three badges.
const instance = figma.selectedInstance
const fallback = {
  title: 'Finance Nerd',
  caption: '8 of 10 Articles read',
  progress: 80,
  accent: 'green',
  icon: 'learn',
}
const badge =
  instance.getEnum('Property 1', {
    'Finance Nerd': fallback,
    'Double Down': {
      title: 'Double Down',
      caption: '1 of 2 goals this month',
      progress: 50,
      accent: 'blue',
      icon: 'piggybank',
    },
    'Stack Master': {
      title: 'Stack Master',
      caption: '$194.70 of $500.00 total savings',
      progress: 39,
      accent: 'magenta',
      icon: 'chart',
    },
  }) ?? fallback

export default {
  id: 'badge-card',
  imports: ['import { BadgeCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<BadgeCard
  title="${badge.title}"
  caption="${badge.caption}"
  progress={${badge.progress}}
  accent="${badge.accent}"
  icon="${badge.icon}"
/>`,
}
