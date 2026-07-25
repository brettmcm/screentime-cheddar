// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4479-1769
// source=src/components/cards/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'

const instance = figma.selectedInstance
const titleHandle = instance.findText('Title')
const title =
  titleHandle.type === 'TEXT'
    ? titleHandle.textContent
    : 'How to decide what to save for'
const descriptionHandle = instance.findText('Description')
const description =
  descriptionHandle.type === 'TEXT'
    ? descriptionHandle.textContent
    : "With so much noise, figure out what's actually worth saving and what you can let go of."

export default {
  id: 'article-card-large',
  imports: [
    'import { ArticleCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<ArticleCard
  size="large"
  title="${title}"
  description="${description}"
  image={demoAssets.articles.piggyBank}
  actionLabel="Read more"
  onAction={() => {}}
/>`,
}
