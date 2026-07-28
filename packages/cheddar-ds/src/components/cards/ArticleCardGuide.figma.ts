// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5003-16391
// source=src/components/cards/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'

const instance = figma.selectedInstance
const titleHandle = instance.findText('Title')
const title = titleHandle.type === 'TEXT' ? titleHandle.textContent : 'Savings 101'
const descriptionHandle = instance.findText('Description')
const description =
  descriptionHandle.type === 'TEXT'
    ? descriptionHandle.textContent
    : 'Learn how to get started with saving'

export default {
  id: 'article-card-guide',
  imports: ['import { ArticleCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<ArticleCard
  size="small"
  eyebrow="Guide"
  title="${title}"
  description="${description}"
  readTime="20 min"
  onClick={() => {}}
/>`,
}
